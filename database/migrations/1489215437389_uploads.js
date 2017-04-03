'use strict'

const Schema = use('Schema')

class UploadsTableSchema extends Schema {

  up () {
    this.create('uploads', (table) => {
      table.increments()
      table.text('audioUrl')
      table.timestamps()
    })
  }

  down () {
    this.drop('uploads')
  }

}

module.exports = UploadsTableSchema
