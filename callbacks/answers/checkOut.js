const { bot } = require('../../bot_setup')
const mongoose = require('mongoose')
const User = mongoose.model("User")


module.exports = function (queryId, tgId) {
    const keyboard = [
        [
          {
            text: 'Оплатил(а)',
            callback_data: `orderPayed`
          }
        ]
      ]

    User.findOne({tgId}).then(user => {
        let message = user.addedProducts.reduce((currentMessage, product) => {
            return currentMessage + `${product.name} - ${product.price}\n`
        }, '')
        message = 'Оплатите ваш заказ.\nВаш заказ:\n' + message

        bot.sendMessage(tgId, message, {reply_markup: {"inline_keyboard": keyboard}})
        bot.answerCallbackQuery(queryId)
    })
}