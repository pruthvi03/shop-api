const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    "color":{
        type:String,
        required:true
    },
    "icon":{
        type:String,
        default:''
    }
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;