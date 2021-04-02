const { bot } = require('../../bot_setup')
const mongoose = require('mongoose')
const User = mongoose.model("User")


module.exports = function showCart (queryId, tgId) {
    const keyboard = [
        [
          {
            text: 'Оформить',
            callback_data: `checkOut`
          }
        ]
      ]

    User.findOne({tgId}).then(user => {
      if (user.addedProducts.length === 0) return bot.sendMessage(tgId, 'В корзине нет товаров')
      
      const message = user.addedProducts.reduce((currentMessage, product) => {
          return currentMessage + `${product.name} - ${product.price}\n`
      }, '')

      bot.sendMessage(tgId, message, {reply_markup: {"inline_keyboard": keyboard}})
    })
}