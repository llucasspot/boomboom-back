import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    // Create a temporary new column to hold the TEXT version of abilities
    await this.schema.alterTable(this.tableName, (table) => {
      table.text('new_abilities').notNullable().defaultTo('')
    })

    // Migrate existing JSON abilities to TEXT
    await this.schema.raw(`
      UPDATE ${this.tableName}
      SET new_abilities = JSON_EXTRACT(abilities, '$')
    `)

    // Drop the original JSON abilities column
    await this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('abilities')
    })

    // Rename the temporary column to abilities
    await this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('new_abilities', 'abilities')
    })
  }

  async down() {
    await this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('abilities')
      table.json('abilities').notNullable()
    })
  }
}
