/**
 * Node Dependencies
 */

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var favicon = require('serve-favicon')
var debug = require('debug')('app')
var mongoose = require('mongoose')

var app = express()

/**
 * Connect to MongoDB
 */

app.db = require('./mongoose/connection')
require('./models/projects')(app, mongoose)

/**
 * View Engine Setup & Public Files & favicon
 */

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
debug(path.join(__dirname, 'public'))
app.use(favicon(path.join(__dirname, '/public/favicon.ico')))

/**
 * Setup BodyParser
 */

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * Setup Routes
 */

var index = require('./routes/index')
app.use('/', index)

/**
 * Catch 404 Errors & Forward to Error Handlers
 */

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

/**
 * Error Handlers (Development vs Production)
 */

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message
  })
})

module.exports = app
