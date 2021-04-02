const { bot } = require('../bot_setup')
const mongoose = require('mongoose')
const Product = mongoose.model("Product")

module.exports = (msg, match) => {
    const [name, price] = match[1].split('/')
    if (!name || !price) return bot.sendMessage(msg.chat.id, 'Вы ввели не все данные для создания продукта')
    
    const product = new Product({
        name,
        price
    })
    
    product.save()
    .then(res => bot.sendMessage(msg.chat.id, 'Новый продукт успешно добавлен'))
    .catch(err => bot.sendMessage(msg.chat.id, 'Возникла внутренняя ошибка'))
}