const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    buyerTgId: Number,
    addedProducts: [
        {
            name: String,
            price: String
        }
    ]
})

mongoose.model("Order", orderSchema)