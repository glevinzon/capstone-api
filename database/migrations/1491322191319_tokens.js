'use strict'

const Schema = use('Schema')

class TokensTableSchema extends Schema {

  up () {
    this.create('tokens', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.string('device_token', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tokens')
  }

}

module.exports = TokensTableSchema
