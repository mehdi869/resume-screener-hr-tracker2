const mongoose = require('mongoose');

const Job2Schema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    
},{timestamps: true});

module.exports = mongoose.model('Job2', Job2Schema);