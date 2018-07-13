import jwt from 'jsonwebtoken';
import client from '../libs/redis';
var key="i dont fukcing know that shit";
export const generate = async (username)=>{
    let clientid=Math.random().toString(32).slice(2)+Math.random().toString(32).slice(2);
    try {
        var token=jwt.sign({
            username: username,
            clientid:clientid
          },key, { expiresIn: 60 * 60*24*30 });   
        await client.hsetAsync(username,"clientid",clientid);
        return token;
    } catch (error) {
        return false;
    }   
}
