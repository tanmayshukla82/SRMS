const mongoose = require('mongoose');


const subjectSchema = new mongoose.Schema({
    department : {
        type : String,
        required : [true, 'Department name required.'],
        unique : true
    },
    subjectname : {
        type : String,
        required : [true, 'Subject name required.']
    },
    subjectCode : {
        type : String,
        required : [true, 'Subject Code required.']
    },
    semester : {
        type : Number,
        required : [true, 'Semester Required'],
        max : 4,
    },
    year : {
        type : Number,
        max : 2
    }
});

const Subject = new mongoose.model('Subject',subjectSchema);
module.exports = Subject; 