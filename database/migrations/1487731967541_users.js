'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.string('username', 255).notNullable()
      table.string('role', 45).defaultTo('user')
      table.integer('active', 1).defaultTo(1).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
