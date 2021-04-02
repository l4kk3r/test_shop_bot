const mongoose = require('mongoose')
const config = require("../config.json");

mongoose.connect(config.MONGODB_SECRET, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', ()=>{
    console.log('MONGODB succesfully connected')
})

mongoose.connection.on('error', ()=>{
    console.log('MONGOBD gave error')
})