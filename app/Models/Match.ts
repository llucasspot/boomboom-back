import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuid } from 'uuid'
import { beforeCreate } from '@adonisjs/lucid/build/src/Orm/Decorators'

/**
 * @swagger
 * components:
 *  schemas:
 *    Match:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        matcherUserId:
 *          type: string
 *        matchedUserId:
 *          type: string
 */
export default class Match extends BaseModel {
  @beforeCreate()
  public static async createUUID(match: Match) {
    match.id = uuid()
  }

  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Matcher user relation
   */
  @column()
  public matcherUserId: User['id']
  @belongsTo(() => User, { foreignKey: 'matcherUserId' })
  public matcherUser: BelongsTo<typeof User>

  /**
   * Matched user relation
   */
  @column()
  public matchedUserId: User['id']
  @belongsTo(() => User, { foreignKey: 'matchedUserId' })
  public matchedUser: BelongsTo<typeof User>
}
