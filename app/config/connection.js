const mongoose = require('mongoose');

function connectDB(){
const url = "mongodb://localhost:27017/srms";
mongoose.connect(url,{useNewUrlParser:true});
const db = mongoose.connection;
db.once('open',()=>{
    console.log("Database connected!!");
});
db.on('error',()=>{
    console.log("Error in connecting");
})
};

module.exports = connectDB;
