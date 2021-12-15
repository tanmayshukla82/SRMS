const mongoose = require('mongoose');
const validator = require('validator');
const student_model = new mongoose.Schema({
    
    Name : String,
    Semester : {
        type:Number,
        min:1,
        max:8,
    },
    section : {
        type : String
    },
    Course:{
        type:String,
    },
    Branch:{
        type:String,
    },
    DOB:{
        type:String,
        required:[true,'DOB required']
    },
    Father_name:{
        type:String,
        required:true
    },
    registrationNumber:
    {
        type:String,
    },
    Department :{
        type : String,
    },
    Email : {
        type:String,
        unique:true,
        trim:true,
        validate:{
            validator : validator.isEmail,
            message : 'Not a valid email',
            isAsync : false
        }
    },
    phone_number:{
        type:String,
        unique:true,
        validate:{
            validator: function (v) {
            return /^[0-9]{10}/.test(v);
      },
      message: '{VALUE} is not a valid 10 digit number!'
    }
    },
    subjects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Subject'
    }],
    aadharCard : {
        type : Number,
        required : true
    },
    gender : {
        type : String
    },
    password : {
        type : String
    },
    batch : {
        type : String
    },
    role: {
        type: String,
        default: "student"
    },
    otp : {
        type : String
    }
},{
    timestamps:true
});

const Student = mongoose.model('Student',student_model);
module.exports = Student;
