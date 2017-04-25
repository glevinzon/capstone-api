'use strict'

const Schema = use('Schema')

class PreferencesTableSchema extends Schema {

  up () {
    this.create('preferences', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.integer('eqId', 10).unsigned().nullable().defaultTo(null).references('id').inTable('equations').onDelete('CASCADE').onUpdate('NO ACTION')
      table.string('audioUrl', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('preferences')
  }

}

module.exports = PreferencesTableSchema
