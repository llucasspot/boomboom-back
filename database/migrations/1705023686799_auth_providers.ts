import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_providers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name', 255).notNullable()
      table.string('provider_user_id', 255).notNullable().unique()
      table.string('access_token', 255).notNullable().unique()
      table.string('refresh_token', 255).notNullable().unique()
      table.string('type', 255).notNullable()
      table.integer('expires_in')
      table.timestamp('expires_at')

      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.primary(['name', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
