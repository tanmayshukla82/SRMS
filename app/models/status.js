const mongoose = require('mongoose');
const status = new mongoose.Schema({
    batch : {
        type : String
    },
    examType : {
        type : String
    },
    status : {
        type : Boolean
    }
});

const Status = mongoose.model('Status',status);
module.exports = Status;
