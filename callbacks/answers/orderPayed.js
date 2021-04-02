const { bot } = require('../../bot_setup')
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Order = mongoose.model("Order")


module.exports = function (queryId, tgId) {
    User.findOne({tgId}).then(user => {
        const order = new Order({
            buyerTgId: tgId,
            addedProducts: user.addedProducts
        })

        order.save().then(ans=>console.log(ans))
    })
    
    User.updateOne({tgId}, {$set: {addedProducts: []}}).then(ans=>console.log(ans))

    bot.sendMessage(tgId, 'Оплата прошла.\nСпасибо за покупку')
    bot.sendMessage('@shop8910_admins', 'Пришёл заказ')
    bot.answerCallbackQuery(queryId)
}