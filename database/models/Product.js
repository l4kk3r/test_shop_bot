const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    price: String
})

mongoose.model("Product", productSchema)