const TelegramBot = require('node-telegram-bot-api')
const config = require("./config.json");

const bot = new TelegramBot(config.TELEGRAM_SECRET, {polling: true})

module.exports = {
    bot: bot
}