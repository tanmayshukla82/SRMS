const mongoose = require('mongoose');
const validator = require('validator');
const student_model = new mongoose.Schema({
    Name : String,
    Semester : {
        type:Number,
        min:1,
        max:8,
        required:[true,'Semester required']
    },
    Course:{
        type:String,
        required:[true,'Course name required']
    },
    Branch:{
        type:String,
        required:[true,'Branch name required']
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
        required:[true,'Admission Number required'],
        unique:true
    },
    University_roll_num:
    {
        type:Number,
        required:[true, 'University Roll number required'],
        unique:true
    },
    Email : {
        type:String,
        required:[true,'Email reqired'],
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
        required:[true,'Phone number required'],
        unique:true
    }

},{
    timestamps:true
});

const Student = mongoose.model('Student',student_model);
module.exports = Student;
