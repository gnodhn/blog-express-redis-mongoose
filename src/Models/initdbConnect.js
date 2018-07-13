import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log(`connected to mongodb using mongoose!`);
});