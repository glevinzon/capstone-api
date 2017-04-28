'use strict'

const Schema = use('Schema')

class RequestsTableSchema extends Schema {

  up () {
    this.create('requests', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.integer('eqId', 10).unsigned().nullable().defaultTo(null).references('id').inTable('equations').onDelete('CASCADE').onUpdate('NO ACTION')
      table.string('name', 255).notNullable()
      table.string('token', 255).notNullable()
      table.integer('active', 1).defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('requests')
  }

}

module.exports = RequestsTableSchema
