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
const routes = Router();

routes.get('/',async (req,res,next)=>{
    try {
        var id=encodeURI(req.query.id.toString());
        let data=await db.post.findById(id);
        if(data) res.status(200).json(data);
            else {
                err=new Error;
                err.status=404;
                next(err);
            }
    } catch (error) {
        res.status(404).end();
    }
})

routes.post('/',auth,async (req,res,next)=>{
    try {
        var title=req.body.title.toString();
        var content=req.body.content.toString();
        var like=0;
        var newpost=await new db.post({
            title:title,
            content:content,
            like:like,
            owner:req.user.username
        })
        var data=await newpost.save();
        await client.lpushAsync(req.user.username+'_post',data._id);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).end();
    }
})

routes.delete('/',auth,async (req,res)=>{
    try {
        var id=encodeURI(req.body.id.toString());
        var data=await db.post.findById(id);
        if(data){
            if(req.user.username===data.owner) {
                await data.remove();
                res.status(200).end();
            } else res.status(401).end();
        } else res.status(404).end();
    } catch (error) {
        res.status(404).end();
    }
})

routes.put('/',auth,async (req,res)=>{
    try {
        let id=req.body.id.toString();
        let title=req.body.title.toString();
        let content=req.body.content.toString();
        let post=await db.post.findByIdAndUpdate(id);
        if(!post) res.status(404).end();
            else {
                if(post.owner!==req.user.username) return res.status(401).end();
                post.title=title;
                post.content=content;
                await post.save();
                res.status(200).end();
            }
    } catch (error) {
        res.status(400).end();
    }
})
export default routes;