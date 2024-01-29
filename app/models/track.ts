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
 *          format: uri
 *        spotifyImage:
 *          type: string
 *          format: uri
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
 *      required:
 *        - id
 *        - createdAt
 *        - updatedAt
 *        - userId
 */
export default class Track extends BaseModel {
  @beforeCreate()
  static async createUUID(track: Track) {
    track.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name?: string

  @column({ serializeAs: 'albumName' })
  declare albumName?: string

  @column({ serializeAs: 'spotifyUri' })
  declare spotifyUri?: string

  @column({ serializeAs: 'spotifyImage' })
  declare spotifyImage?: string

  @column({ serializeAs: 'spotifyId' })
  declare spotifyId?: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  /**
   * User relation
   */
  @column({ serializeAs: 'userId' })
  declare userId: User['id']
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
