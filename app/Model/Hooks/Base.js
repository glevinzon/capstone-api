'use strict'

const Base = exports = module.exports = {}
const uuid = use('node-uuid')

Base.generateCode = function * (next) {

  if (typeof this.code === 'undefined') {
    this.code = uuid.v4()
  }

  yield next

}
