import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Gender from './Gender'
import User from 'App/Models/User'
import { v4 as uuid } from 'uuid'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'

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
 *          type: DateTime
 *        description:
 *          type: string
 *        createdAt:
 *          type: DateTime
 *        updatedAt:
 *          type: DateTime
 *        preferedGender:
 *          type: number
 *        gender:
 *          type: number
 *        userId:
 *          type: string
 */
export default class Profile extends BaseModel {
  @beforeCreate()
  public static async createUUID(profile: Profile) {
    profile.id = uuid()
  }

  @column({ isPrimary: true })
  public id: string

  @column.date({ autoCreate: false, autoUpdate: false })
  public dateOfBirth: DateTime

  @column()
  public description: string

  @column()
  public avatarUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * User prefered gender relation
   */
  @column()
  public preferedGenderId: Gender['id']
  @belongsTo(() => Gender, { foreignKey: 'preferedGenderId' })
  public preferedGender: BelongsTo<typeof Gender>

  /**
   * User Gender relation
   */
  @column()
  public genderId: Gender['id']
  @belongsTo(() => Gender, { foreignKey: 'genderId' })
  public gender: BelongsTo<typeof Gender>

  /**
   * User relation
   */
  @column()
  public userId: User['id']
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
