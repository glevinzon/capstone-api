'use strict'

const Lucid = use('Lucid')

class Base extends Lucid {
  static boot() {
    super.boot()

    /**
     * Generate a code for each model
     *
     * @author glen
     */
    this.addHook('beforeCreate', 'Base.generateCode')
    this.$booted = false
  }

}

module.exports = Base
