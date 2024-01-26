import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gender, { GenderName } from '#models/gender'

export default class extends BaseSeeder {
  async run() {
    await Gender.createMany([
      {
        name: GenderName.MALE,
      },
      {
        name: GenderName.FEMALE,
      },
      {
        name: GenderName.OTHER,
      },
    ])
  }
}
