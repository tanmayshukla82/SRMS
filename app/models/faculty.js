const mongoose = require('mongoose');
const validator = require('validator');
const facultySchema = mongoose.Schema({
    name : {
        type : String
    },
    dob: {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true,
        // validate : validator.isEmail()
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
    facultyMobileNumber: {
        type: Number
    },
    aadharCard: {
        type: Number
    },
    role: {
        type: String,
        default: "faculty"
    },
    otp :{
        type : String
    },
},{ timestamps : true });

const Faculty = new mongoose.model('Faculty', facultySchema);
module.exports = Faculty;