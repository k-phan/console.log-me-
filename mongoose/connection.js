var mongoose = require('mongoose')
var debug = require('debug')('mongoose-connection')

const uri = ('mongodb://' + process.env.MONGO_IP + ':' +
  process.env.MONGO_PORT + '/' + process.env.MONGO_MONGOOSE)

module.exports = mongoose.createConnection(uri, function (err) {
  if (err) {
    debug('Error: ' + err)
    throw new Error('No MongoDB available: ' + err)
  } else {
    debug('Connected created.')
  }
})
