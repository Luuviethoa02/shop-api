const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name :{
        type: String,
        require : true,
        unique : true
    },
    slug:{
        type: String,
        require : true,
        unique : true
    }
},{timestamps: true})

const SizeModel = mongoose.model('sizes', schema)

module.exports = SizeModel;