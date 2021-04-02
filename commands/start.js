const { bot } = require('../bot_setup')
const mongoose = require('mongoose')
const User = mongoose.model("User")

const commands_message = `/add_product - Добавить товар\n/list_products - Список всех товаров`

module.exports = (msg, match) => {
    User.findOne({tgId: msg.chat.id}).then(user => {
        if (user) return bot.sendMessage(msg.chat.id, 'С возвращением\n' + commands_message)

        const newUser = new User({
            tgId: msg.chat.id
        })

        newUser.save()
        .then(res => bot.sendMessage(msg.chat.id, 'Добро пожаловать!' + commands_message))
        .catch(err => bot.sendMessage(msg.chat.id, 'Возникла внутренняя ошибка'))
    }).catch(err => console.log(err))
}