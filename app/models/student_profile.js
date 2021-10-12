const mongoose = require('mongoose');
const validator = require('validator');
const student_model = new mongoose.Schema({
    Name : String,
    Semester : {
        type:Number,
        min:1,
        max:8,
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
    Admission_number:{
        type:Number,
        unique:true
    },
    University_roll_num:
    {
        type:Number,
        unique:true
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
    Age:Number,
    phone_number:{
        type:String,
        max:10,
        unique:true
    }

},{
    timestamps:true
});

const Student = mongoose.model('Student',student_model);
module.exports = Student;
