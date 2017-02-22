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
}

module.exports = Equation
