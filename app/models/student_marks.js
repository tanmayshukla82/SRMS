const mongoose = require('mongoose');
const Student = require('./student_profile');
const Subject = require('./student_subject');


const marksSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Student
    },
    subject : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Subject
    },
    semester:{
        type : Number
    },
    examType : {
        type : String,
    },
    marks : {
        type : Number,
        default : 0
    },
    totalMarks : {
        type : Number,
        default : 100
    }
});

const Marks = new mongoose.model('Mark',marksSchema);
module.exports = Marks; 