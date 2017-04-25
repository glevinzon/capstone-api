'use strict'

const Base = use('App/Model/Base')

/**
 *
 * @author glen
 */
class Preference extends Base {

  equation() {
    return this.belongsTo('App/Model/Equation')
  }
}

module.exports = Preference
