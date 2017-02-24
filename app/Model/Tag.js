'use strict'

const Base = use('App/Model/Base')

/**
 *
 * @author glen
 */
class Tag extends Base {

  records() {
    return this.hasMany('App/Model/Record', 'id', 'tagId');
  }
}

module.exports = Tag
