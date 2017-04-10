/**
 * Node Dependencies
 */

var express = require('express')
var router = express.Router()
var debug = require('debug')('index-router')

router.get('/', function (req, res, next) {
  return res.render('landing')
})

router.get('/home', function (req, res, next) {
  return res.redirect('/')
})

router.get('/resume', function (req, res, next) {
  return res.redirect('/files/Khai_Phan_Resume.pdf')
})

router.get('/projects', function (req, res, next) {
  return res.render('construction')
})

router.get('/gallery', function (req, res, next) {
  return res.render('construction')
})

router.get('/aboutme', function (req, res, next) {
  return res.render('construction')
})

module.exports = router
