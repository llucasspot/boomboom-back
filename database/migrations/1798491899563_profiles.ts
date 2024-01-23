import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.date('date_of_birth').notNullable()
      table.text('description')
      table.string('avatar_url', 2048)

      table
        .integer('prefered_gender_id')
        .unsigned()
        .references('id')
        .inTable('genders')
        .onDelete('RESTRICT')
      table.integer('gender_id').unsigned().references('id').inTable('genders').onDelete('RESTRICT')
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
