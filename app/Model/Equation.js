'use strict'

const Base = use('App/Model/Base')

/**
 *
 *
 * @author glen
 */
class Equation extends Base {

  user () {
    return this.belongsTo('App/Model/User')
  }

  tag () {
    return this.belongsTo('App/Model/Tag')
  }

  records () {
    return this.hasMany('App/Model/Record', 'id', 'eqId')
  }
}

module.exports = Equation
