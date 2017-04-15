'use strict'

exports = module.exports = function (app, mongoose) {
  var Project = new mongoose.Schema({
    title: { type: String, default: '' },
    what: [{ type: String }],
    why: { type: String, default: '' },
    where: { type: String, default: '' },
    image: { type: String, default: '' },
    links: [{
      name: { type: String },
      link: { type: String }
    }]
  })

  app.db.model('Project', Project)
}
