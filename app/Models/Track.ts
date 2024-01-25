import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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
  static async createUUID(track: Track) {
    track.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare albumName?: string

  @column()
  declare spotifyUri: string

  @column()
  declare spotifyImage: string

  @column()
  declare spotifyId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * User relation
   */
  @column()
  declare userId: User['id']
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
