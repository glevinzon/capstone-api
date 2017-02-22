'use strict'

const Schema = use('Schema')

class EquationsTableSchema extends Schema {

  up () {
    this.create('equations', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.integer('userId', 10).unsigned().nullable().defaultTo(null).references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION')
      table.string('name', 255).notNullable()
      table.text('note')
      table.text('audioUrl')
      table.integer('active', 1).defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('equations')
  }

}

module.exports = EquationsTableSchema
