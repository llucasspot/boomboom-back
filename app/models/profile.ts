import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Gender from '#models/gender'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

/**
 * @swagger
 * components:
 *  schemas:
 *    Profile:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        dateOfBirth:
 *          type: string
 *          format: date-time
 *        description:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        preferedGenderId:
 *          type: number
 *        genderId:
 *          type: number
 *        userId:
 *          type: string
 *      required:
 *        - id
 *        - dateOfBirth
 *        - createdAt
 *        - updatedAt
 *        - preferedGenderId
 *        - genderId
 *        - userId
 */
export default class Profile extends BaseModel {
  @beforeCreate()
  static async createUUID(profile: Profile) {
    profile.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column.date({ autoCreate: false, autoUpdate: false })
  declare dateOfBirth: DateTime

  @column()
  declare description: string

  @column()
  declare avatarUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * User prefered gender relation
   */
  @column()
  declare preferedGenderId: Gender['id']
  @belongsTo(() => Gender, { foreignKey: 'preferedGenderId' })
  declare preferedGender: BelongsTo<typeof Gender>

  /**
   * User Gender relation
   */
  @column()
  declare genderId: Gender['id']
  @belongsTo(() => Gender, { foreignKey: 'genderId' })
  declare gender: BelongsTo<typeof Gender>

  /**
   * User relation
   */
  @column()
  declare userId: User['id']
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
