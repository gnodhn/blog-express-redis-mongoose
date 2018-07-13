import {Router} from 'express';
import client from './../libs/redis';
import {generate} from '../libs/jswtookit';
import jwt from 'jsonwebtoken';
import auth from '../libs/auth';
import upload from '../libs/multer';
import base64ArrayBuffer from '../libs/base64ArrayBuffer';
import axios from 'axios';
import db from '../Models/db';
import mongoose from 'mongoose';
var key="i dont fukcing know that shit";
var jtk={
    generate:generate
}
const routes=Router();

routes.get('/:username',async (req,res)=>{
    try {
        let username=req.params.username.toString();
        let info=await client.hgetallAsync(username);
        if(info!==null){
            let postlist=await client.llenAsync(username+`_post`);
            let postid=await client.lrangeAsync(username+`_post`,0,postlist-1);
            var data={
                ...info,
                password:undefined,
                clientid:undefined,
                post:postid
            }
            res.status(200).json(data);
        }
            else res.status(404).end();
    } catch (error) {
        console.log(error);
        res.status(404).end();
    }
})
routes.post('/login',async (req,res)=>{
    try {
        var username=req.body.username.toString();
        var password=req.body.password.toString();
    } catch (error) {
        return res.status(400).json({err:"check your submit"});
    }
    try {
        var getpass=await client.hgetAsync(username,'password');
        if(getpass!==password) return res.status(400).json({err:"check your submit"});
            else {
                var token=await jtk.generate(username);
                res.status(200).json({token:token});
            }
    } catch (error) {
        
    }
})

routes.put('/',auth,async(req,res)=>{
    console.log(req.body);
    try {
        let decoded = jwt.verify(req.body.jwt,key);
        let username=decoded.username;
        let newpassword=req.body.newpassword;
        await client.hsetAsync(username,"password",newpassword);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
})
routes.post('/',async (req,res)=>{
    try {
        var username=req.body.username.toString();
        var password=req.body.password.toString();
    } catch (error) {
        return res.status(400).json({err:"check your form"});
    }
    console.log(username,password);
    try {
        let check=await client.existsAsync(username);
        if(check===0){
            await client.hmsetAsync(username,"password",password);
            return res.status(200).end();
        } else return res.status(400).json({err:"user da ton tai"});
    } catch (error) {
        return res.status(400).json({err:"check your submit"});
    }
})

routes.post('/upload/',upload.any(),async (req,res)=>{
    try {
        var base64=base64ArrayBuffer(req.files[0].buffer);
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization':'Client-ID 09731551a5dedbe'
            }
          }
        var rp=await axios.post('https://api.imgur.com/3/upload',{         
                image:base64
            },axiosConfig);
        res.status(200).json(rp.data);
    } catch (error) {
        res.status(400).end();
    }
})

export default routes;