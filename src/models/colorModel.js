const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name :{
        type: String,
        require : true,
        unique : true
    },
    codeColor:{
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

const ColorModel = mongoose.model('colors', schema)

module.exports = ColorModel;