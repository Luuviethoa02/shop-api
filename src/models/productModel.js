const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name :{
        type: String,
        require : true,
    },
    avt :{
        type: String,
        require : true,
    },
    price :{
        type: Number,
        require : true,
    },
    brand_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands' ,
        required: true
    },
    size_id : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sizes' ,
        required: true
        }
    ],
    color_id : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'colors' ,
        required: true
        }
    ],
    des: {
        type: String,
        default: ''
    },
    slug:{
        type: String,
        require : true,
    }
    
},{timestamps: true})

const ProductdModel = mongoose.model('products', schema)

module.exports = ProductdModel;