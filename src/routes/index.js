const express = require('express')
const route = express.Router()

route.use('/', require('./category'))
route.use('/', require('./order'))
route.use('/', require('./product'))
route.use('/', require('./user'))

  

module.exports = route