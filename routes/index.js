/**
 * Node Dependencies
 */

var express = require('express')
var router = express.Router()
var debug = require('debug')('index-router')

router.get('/', function (req, res, next) {
  return res.render('landing')
})

module.exports = router
