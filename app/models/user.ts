import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { v4 as uuid } from 'uuid'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import Track from '#models/track'

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
 *      required:
 *        - id
 *        - name
 *        - email
 *        - createdAt
 *        - updatedAt
 */
export default class User extends BaseModel {
  static authTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  currentAccessToken?: AccessToken

  @beforeCreate()
  static async createUUID(user: User) {
    user.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * Profile relation
   */
  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  /**
   * Track relation
   */
  @hasMany(() => Track)
  declare tracks: HasMany<typeof Track>
}
