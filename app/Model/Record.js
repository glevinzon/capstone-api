'use strict'

const Base = use('App/Model/Base')

/**
 *
 * @author glen
 */
class Record extends Base {

  equation() {
    return this.belongsTo('App/Model/Equation')
  }
  tag() {
    return this.belongsTo('App/Model/Tag')
  }
}

module.exports = Record
