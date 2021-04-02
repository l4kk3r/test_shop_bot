const { bot } = require('../bot_setup')


module.exports = function (tgId, product) {
    const keyboard = [
        [
          {
            text: 'Добавить',
            callback_data: `add:${product._id}`
          }
        ],
        [
            {
                text: 'Посмотреть корзину',
                callback_data: 'showCart'
            }
        ]
    ]

    bot.sendMessage(tgId, `${product.name} - ${product.price}`, {reply_markup: {"inline_keyboard": keyboard}}) 
}