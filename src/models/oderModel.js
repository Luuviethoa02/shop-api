const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    type_pay:{
        type: Boolean,
        require : true,
    }

},{timestamps: true})

const OderModel = mongoose.model('oders', schema)

module.exports = OderModel;