const mongoose = require('mongoose')
const { Schema } = mongoose


const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    registrationNumber: {
        type: String
    },
    department: {
        type: String
    },
    dob: {
        type: String,
    },
    joiningYear: {
        type: String
    },
    contactNumber: {
        type: Number,
    },
    role: {
        type: String,
        default: "admin"
    }

});

const Admin = new mongoose.model('Admin',adminSchema);
module.exports = Admin;