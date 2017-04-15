/**
 * Node Dependencies
 */

var express = require('express')
var crypto = require('crypto')
var router = express.Router()
var debug = require('debug')('index-router')
var shortid = require('shortid')

var configs = require('../config')

router.get('/', function (req, res, next) {
  return res.render('landing')
})

router.get('/home', function (req, res, next) {
  return res.redirect('/')
})

router.get('/resume', function (req, res, next) {
  return res.redirect('/files/Khai_Phan_Resume.pdf')
})

// TODO: clean this up
router.post('/getS3UploadCredentials', function (req, res, next) {
  /* GREAT BLOG POST -- REALLY HELPED
   * http://www.surenderthakran.com/articles/tech/s3-browser-upload-with-nodejs
   */

  debug('in getS3Credentials, received: ' + req.body.fileName)

  if (req.body.password !== process.env.PASSWORD) {
    debug('Incorrect Password')
    return res.status(400).send()
  }

  if (req.body.fileName !== undefined && req.body.fileName !== null) {
    debug('Creating Credentials...')

    var uploadUrl = 'https://' + configs.bucket + '.s3.amazonaws.com'

    var date = new Date().toISOString()
    var dateString = date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2)
    var credential = configs.access_key + '/' + dateString + '/' + configs.region + '/s3/aws4_request'

    var randomId = shortid.generate()
    randomId = randomId + req.body.fileName

    var policy = {
      expiration: new Date((new Date()).getTime() + (1 * 60 * 1000)).toISOString(),
      conditions: [
        { bucket: configs.bucket },
        { key: randomId },
        { acl: configs.acl },
        { success_action_status: configs.success_action_status },
        ['content-length-range', 0, 2000000],
        { 'x-amz-algorithm': configs['x-amz-algorithm'] },
        { 'x-amz-credential': credential },
        { 'x-amz-date': dateString + 'T000000Z' }
      ]
    }

    var policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64')

    var dateKey = createHmacDigest('AWS4' + configs.secret_key, dateString)
    var dateRegionKey = createHmacDigest(dateKey, configs.region)
    var dateRegionServiceKey = createHmacDigest(dateRegionKey, 's3')
    var signingKey = createHmacDigest(dateRegionServiceKey, 'aws4_request')

    var xAmzSignature = createHmacDigest(signingKey, policyBase64).toString('hex')

    debug('Signature: ' + xAmzSignature)

    var params = {
      key: randomId,
      acl: configs.acl,
      success_action_status: configs.success_action_status,
      policy: policyBase64,
      'x-amz-algorithm': configs['x-amz-algorithm'],
      'x-amz-credential': credential,
      'x-amz-date': dateString + 'T000000Z',
      'x-amz-signature': xAmzSignature
    }

    debug('Signature: ' + xAmzSignature)

    var result = {
      upload_url: uploadUrl,
      params: params
    }

    debug('Result: ' + result)

    return res.json(result)
  } else {
    debug('Failure, redirecting.')
    return res.status(400).send()
  }
})

router.get('/projects', function (req, res, next) {
  req.app.db.models.Project.find({}, function (err, project) {
    if (err) {
      return res.status(500).end()
    } else {
      return res.render('projects', { projects: project })
    }
  })
})

router.get('/projects/edit', function (req, res, next) {
  return res.render('project_forms')
})

router.post('/projects/new', function (req, res, next) {
  if (req.body.password === process.env.PASSWORD) {
    debug(req.body)
  } else {
    return res.redirect('/projects')
  }

  var fields = {
    title: req.body.title,
    what: [req.body.what1, req.body.what2],
    why: req.body.why,
    where: req.body.where,
    image: req.body.image_url,
    links: [
      { name: req.body.linkname1,
        link: req.body.linkpath1 },
      { name: req.body.linkname2,
        link: req.body.linkpath2 },
      { name: req.body.linkname3,
        link: req.body.linkpath3 }
    ]
  }

  req.app.db.models.Project.create(fields, function (err, project) {
    if (err) {
      debug(err)
      return res.render('error', { message: err })
    } else {
      debug('Create Successful: ' + project)
      return res.redirect('/projects')
    }
  })
})

router.get('/gallery', function (req, res, next) {
  return res.render('construction')
})

router.get('/aboutme', function (req, res, next) {
  return res.render('construction')
})

var createHmacDigest = function (key, string) {
  var hmac = crypto.createHmac('sha256', key)
  hmac.write(string)
  hmac.end()
  return hmac.read()
}

module.exports = router
