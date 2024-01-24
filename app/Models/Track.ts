import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { v4 as uuid } from 'uuid'

/**
 * @swagger
 * components:
 *  schemas:
 *    Track:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        albumName:
 *          type: string
 *        spotifyUri:
 *          type: string
 *        spotifyImage:
 *          type: string
 *        spotifyId:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        userId:
 *          type: string
 */
export default class Track extends BaseModel {
  @beforeCreate()
  public static async createUUID(track: Track) {
    track.id = uuid()
  }

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public albumName?: string

  @column()
  public spotifyUri: string

  @column()
  public spotifyImage: string

  @column()
  public spotifyId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * User relation
   */
  @column()
  public userId: User['id']
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
