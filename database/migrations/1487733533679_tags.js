'use strict'

const Schema = use('Schema')

class TagsTableSchema extends Schema {

  up () {
    this.create('tags', (table) => {
      table.increments()
      table.string('code', 50).notNullable()
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
