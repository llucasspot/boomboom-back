import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export enum ImageType {
  AVATAR = 'avatar',
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Image:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        type:
 *          type: string
 *          enum:
 *            - avatar
 *        fileName:
 *          type: string
 *        height:
 *          type: number
 *        width:
 *          type: number
 *        userId:
 *          type: string
 *      required:
 *        - id
 *        - type
 *        - fileName
 *        - userId
 */
export default class Image extends BaseModel {
  @beforeCreate()
  static async createUUID(image: Image) {
    image.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'fileName' })
  declare fileName: string

  @column()
  declare type: string

  @column()
  declare height?: number

  @column()
  declare width?: number

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
