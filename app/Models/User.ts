import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'
import Track from 'App/Models/Track'
import Profile from 'App/Models/Profile'

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        profileId:
 *          type: string
 */
export default class User extends BaseModel {
  @beforeCreate()
  public static async createUUID(user: User) {
    user.id = uuid()
  }

  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Profile relation
   */
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  /**
   * Track relation
   */
  @hasMany(() => Track)
  public tracks: HasMany<typeof Track>
}
