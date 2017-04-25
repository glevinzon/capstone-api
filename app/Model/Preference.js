'use strict'

const Base = use('App/Model/Base')

/**
 *
 * @author glen
 */
class Preference extends Base {

  equations () {
    return this.hasMany('App/Model/Equation', 'id', 'eqId')
  }
}

module.exports = Preference
