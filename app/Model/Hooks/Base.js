'use strict'

const Base = exports = module.exports = {}
var shortid = require('shortid');

Base.generateCode = function * (next) {

  if (typeof this.code === 'undefined') {
    this.code = shortid.generate()
  }

  yield next

}
