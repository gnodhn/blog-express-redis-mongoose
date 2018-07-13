import jwt from 'jsonwebtoken';
import client from './redis';
var key="i dont fukcing know that shit";
const auth = async (req,res,next)=>{
    try {
        let token=req.body.jwt.toString();
        let decoded = jwt.verify(token,key);
        let getclientid=await client.hgetAsync(decoded.username,"clientid");
        if(getclientid===decoded.clientid) 
            {
                req.user={
                    username:decoded.username
                };
                next();
            }
                else res.status(401).end();
    } catch (error) {
        res.status(401).end(error);
    }
}
export default auth;