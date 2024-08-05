const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name :{
        type: String,
    },
    old :{
        type: String,
    },
    sdt :{
        type: String,
    },
    img : {
        type: String,
        default: ''
    },
   
})

const ShipperModel = mongoose.model('shippers', schema)

module.exports = ShipperModel;