const mongoose = require('mongoose');


const subjectSchema = new mongoose.Schema({
    department : {
        type : String,
    },
    subjectName : {
        type : String,
    },
    subjectCode : {
        type : String,
    },
    semester : {
        type : Number,
        max : 4,
    },
    year : {
        type : Number,
        max : 2
    }
});

const Subject = new mongoose.model('Subject',subjectSchema);
module.exports = Subject; 