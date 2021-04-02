const mongoose = require('mongoose')
const Product = mongoose.model("Product")

const sendProduct = require('./helpers/sendProduct')

module.exports = (msg, match) => {
    Product.find({}).then(products => {
        products.forEach(product => sendProduct(msg.chat.id, product))
    })
}