const TelegramBot = require('node-telegram-bot-api')
const { TELEGRAM_TOKEN } = require('./secret')

// SETUP
const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true})

// KEYBOARDS
const main_menu_keyboard = [['📦 Товары']]

// ARRAYS
let users = []
let notify_users = []

// DATABASE
data = {
    users: [

    ],
    products: [
        {
            id: 1,
            label: 'Манго',
            price: 299,
            description: 'Очень вкусное бразильское манго!'
        },
        {
            id: 2,
            label: 'Яблоко Голден',
            price: 69,
            description: 'Яблоко с нашей грядки!'
        }
    ],
    orders: [

    ]
}

// BOT LOGIC
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.from.id;
    const resp = match[1]; // the captured "whatever"
    if (!users.includes(chatId)) {
        users.push(chatId)
        data.users.push({
            id: data.users.length,
            telegram_id: chatId,
            cart: []
        })
    }
    bot.sendMessage(chatId, '👋Привет! Я лучший интернет магазин', { reply_markup: { "keyboard": main_menu_keyboard, "resize_keyboard": true }});
});

bot.on('message', (msg) => {
    const user_id = msg.chat.id
    const message_text = msg.text

    if (!users.includes(user_id)) {
        users.push(user_id)
        data.users.push({
            id: data.users.length,
            telegram_id: user_id,
            cart: []
        })
    }

    if (message_text.toLowerCase() === '📦 товары') {
        data.products.forEach(product => {
            bot.sendMessage(user_id, `<b>Товар: </b>${product.label}\n<b>Цена: </b>${product.price}\n<b>Описание: </b>${product.description}`, {parse_mode: "HTML", reply_markup: {
                inline_keyboard: [
                    [
                      {
                        text: 'Добавить в корзину',
                        callback_data: `add_tocart_${product.id}`
                      }, 
                      {
                          text: 'Перейти в корзину',
                          callback_data: 'go_tocart'
                      }
                    ]
                  ]
            }})
        })
    }

});

bot.on('callback_query', function (msg) {
    const message_text = msg.data
    const user_id = users.indexOf(msg.from.id)


	if (message_text.includes('add_tocart')) {

        // получаем продукт
        const product_id = Number(message_text.replace('add_tocart_', ''))
        const product = data.products[product_id - 1]
        data.users[user_id].cart.push(product)
        bot.answerCallbackQuery(msg.id, {text: 'Товар успешно добавлен', show_alert: false})

    } else if (message_text.includes('go_tocart')) {

        const cart = data.users[user_id].cart

        if (cart.length === 0) {
            bot.sendMessage(msg.from.id, 'Ваша корзина пуста.')
            bot.answerCallbackQuery(msg.id)
        } else {
            let cart_message = `<b>В вашей корзине ${cart.length} товаров</b>\n\n`
            cart.forEach(item => {
                cart_message = cart_message + `${item.label} - ${item.price}\n-----------------\n`
            })
            bot.sendMessage(msg.from.id, cart_message, {parse_mode: "HTML", reply_markup: {
                inline_keyboard: [
                    [
                      {
                        text: '✅Оформить заказ',
                        callback_data: 'cart_order'
                      },
                      {
                          text: '🗑️Очистить корзину',
                          callback_data: 'cart_clean'
                      }
                    ]
                  ]
            }})
            bot.answerCallbackQuery(msg.id)
        }
    } else if (message_text.includes('cart_clean')) {
        data.users[user_id].cart = []
        bot.answerCallbackQuery(msg.id, {text: 'Корзина успешно очищена', show_alert: false})
    } else if (message_text.includes('cart_order')) {

        const cart = data.users[user_id].cart

        if (cart.length === 0) {
            // если в корзине нет товаров
            bot.sendMessage(msg.from.id, 'Ваша корзина пуста.')
            bot.answerCallbackQuery(msg.id)
        } else {
            // создаем сообщение для корзины и отправляем его
            let cart_message = `<b>В вашей корзине ${cart.length} товаров</b>\n\n`
            cart.forEach(item => {
                cart_message = cart_message + `${item.label} - ${item.price}\n-----------------\n`
            })
            bot.sendMessage(msg.from.id, cart_message, {parse_mode: "HTML", reply_markup: {
                inline_keyboard: [
                    [
                      {
                        text: 'Оплатил(а)',
                        callback_data: 'cart_payed'
                      }
                    ]
                  ]
            }})
            bot.answerCallbackQuery(msg.id)
        }
    } else if (message_text.includes('cart_payed')) {
        const cart = data.users[user_id].cart

        data.orders.push(`Заказ № ${data.users[user_id].cart.length}\nПокупатель: ${data.users[user_id].id}\nЗаказ:\n${data.users[user_id].cart}`)
        data.users[user_id].cart = []
        bot.sendMessage(msg.from.id, '🥳Спасибо за заказ!')
        // уведомляем админов о новом платеже
        let cart_message = ``
        cart.forEach(item => {
            cart_message = cart_message + `${item.label} - ${item.price}\n-----------------\n`
        })
        notify_users.forEach(user => {
            bot.sendMessage(user, `🥳НОВЫЙ ЗАКАЗ!\n\n${cart_message}`)
        }) 
        // отвечаем на query
        bot.answerCallbackQuery(msg.id)
    }
});

// ADMIN BOT LOGIC
// создание нового товара, пример: "/create_new Продукт;Цена;Описание"
bot.onText(/\/create_new (.+)/, (msg, match) => {
    const [label, price, description] = match[1].split(';')
    data.products.push({
        id: data.products.length + 1,
        label,
        price,description
    })
    bot.sendMessage(msg.from.id, '📦Товар успешно добавлен')
});

// подписка на уведомления об оплате
bot.onText(/\/recieve_payments/, (msg, match) => {
    notify_users.push(msg.from.id)
    bot.sendMessage(msg.from.id, 'Вы успешно подписались на уведомления')
});