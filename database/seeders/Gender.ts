import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Gender, { GenderName } from 'App/Models/Gender'

export default class extends BaseSeeder {
  public async run() {
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
