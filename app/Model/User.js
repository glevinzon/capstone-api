'use strict';

const Base = use('App/Model/Base');

class User extends Base {

  equations() {
    return this.hasMany('App/Model/Equation', 'id', 'userId');
  }
}

module.exports = User;
