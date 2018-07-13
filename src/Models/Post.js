import mongoose from 'mongoose';
var postSchema=mongoose.Schema({
    owner:String,
    title:String,
    content:String,
    like:Number,
    comment:String,
})

module.exports=mongoose.model('post',postSchema);