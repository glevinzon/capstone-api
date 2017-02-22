'use strict'

const Schema = use('Schema')

class TagsTableSchema extends Schema {

  up () {
    this.create('tags', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
      table.integer('eqId', 10).unsigned().nullable().defaultTo(null).references('id').inTable('equations').onDelete('CASCADE').onUpdate('NO ACTION')
      table.string('name', 255).notNullable()
      table.integer('active', 1).defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('tags')
  }

}

module.exports = TagsTableSchema
