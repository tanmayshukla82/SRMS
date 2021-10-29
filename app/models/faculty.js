const mongoose = require('mongoose');
const validator = require('validator');
const facultySchema = mongoose.Schema({
    name : {
        type : String
    },
    DOB : {
        type : Date
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : validator.isEmail()
    },
    password: {
        type: String,
    },
    registrationNumber: {
        type: String,
    },
    gender: {
        type: String,
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String, 
        required: true
    },
    facultyMobileNumber: {
        type: Number
    },
    aadharCard: {
        type: Number
    },
    joiningYear: {
        type : Date,
        required : true
    },
    role: {
        type: String,
        default: "faculty"
    }
});

const Faculty = new mongoose.model('Faculty', facultySchema);
module.exports = Faculty;