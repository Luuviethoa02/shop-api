const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name :{
        type: String,
    },
    
   
})

const ReasonModel = mongoose.model('reason', schema)

module.exports = ReasonModel;