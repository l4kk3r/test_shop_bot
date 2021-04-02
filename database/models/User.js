const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    tgId: Number,
    addedProducts: [
        {
            name: String,
            price: String
        }
    ]
})

mongoose.model("User", userSchema)