'use strict'

const Schema = use('Schema')

class RecordsTableSchema extends Schema {

  up () {
    this.create('records', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.integer('eqId', 10).unsigned().nullable().defaultTo(null).references('id').inTable('equations').onDelete('CASCADE').onUpdate('NO ACTION')
      table.integer('tagId', 10).unsigned().nullable().defaultTo(null).references('id').inTable('tags').onDelete('CASCADE').onUpdate('NO ACTION')
      table.timestamps()
    })
  }

  down () {
    this.drop('records')
  }

}

module.exports = RecordsTableSchema
