const mongoose = require('mongoose');

function connectDB(){
const url = process.env.MONGO_URL;
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex :true,useFindAndModify:true});
const db = mongoose.connection;
db.once('open',()=>{
    console.log("Database connected!!");
});
db.on('error',()=>{
    console.log("Error in connecting");
})
};

module.exports = connectDB;
