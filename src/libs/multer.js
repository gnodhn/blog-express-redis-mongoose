import multer from  'multer';
import path from 'path';
var storage = multer.memoryStorage();
var upload = multer({
    limits: { fileSize: 10*1024*1024 },
    fileFilter:function(req,file,cb){
        if((file.mimetype==='image/jpeg')||(file.mimetype==='image/png')) cb(null,true);
            else cb(new Error('This file type is not supported'));
    },
    storage: storage 
})


export default upload;