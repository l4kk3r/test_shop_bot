const { bot } = require('./bot_setup')
const config = require("./config.json");

process.env.TZ = config.TIMEZONE

require('./database/db_setup')
require('./database/models/User');
require('./database/models/Product');
require('./database/models/Order');

const startCommand = require('./commands/start')
const addProductCommand = require('./commands/add_product')
const listProductsCommand = require('./commands/list_products')
const callbackAnswer = require('./callbacks/main')

bot.onText(/\/start/, startCommand)
bot.onText(/\/add_product (.+)/, addProductCommand)
bot.onText(/\/list_products/, listProductsCommand)

bot.on('callback_query', callbackAnswer)