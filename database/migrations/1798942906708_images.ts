import { BaseSchema } from '@adonisjs/lucid/schema'
import { ImageType } from '#models/image'

export default class extends BaseSchema {
  protected tableName = 'images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('file_name', 2048).notNullable()
      table.enum('type', Object.values(ImageType)).notNullable()
      table.integer('height').nullable()
      table.integer('width').nullable()

      table.string('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
