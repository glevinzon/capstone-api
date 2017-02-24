'use strict'

const Base = use('App/Model/Base')

/**
 * Generate a slug for Product
 *
 * @author glen
 */
class Equation extends Base {

  user() {
    return this.belongsTo('App/Model/User')
  }

  records() {
    return this.hasMany('App/Model/Record', 'id', 'eqId');
  }
}

module.exports = Equation
