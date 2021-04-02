const { bot } = require('../../bot_setup')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Product = mongoose.model("Product")


module.exports = function addItem (queryId, tgId, productId) {
    productId = productId.replace('add:', '')
    Product.findOne({_id: productId}).then(product => {
        const update_command = {$push: {addedProducts: product}}
        User.updateOne({tgId}, update_command).then(ans => console.log(ans))
        
        bot.answerCallbackQuery(queryId)
    })
}