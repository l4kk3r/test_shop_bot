const addItemAnswer = require('./answers/addItem')
const showCartAnswer = require('./answers/showCart')
const checkOutAnswer = require('./answers/checkOut')
const orderPayedAnswer = require('./answers/orderPayed')

module.exports = (callback) => {
    if (callback.data.includes('add')) return addItemAnswer(callback.id, callback.from.id, callback.data)
    if (callback.data.includes('showCart')) return showCartAnswer(callback.id, callback.from.id)
    if (callback.data.includes('checkOut')) return checkOutAnswer(callback.id, callback.from.id)
    if (callback.data.includes('orderPayed')) return orderPayedAnswer(callback.id, callback.from.id)
}