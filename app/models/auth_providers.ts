import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { SocialProviders } from '@adonisjs/ally/types'

export default class AuthProviders extends BaseModel {
  @column({ isPrimary: true })
  declare name: keyof SocialProviders

  /**
   * Value of the token
   */
  @column()
  declare accessToken: string

  /**
   * Refresh token
   */
  @column()
  declare refreshToken: string

  /**
   * Token type
   */
  @column()
  declare type: string

  /**
   * Static time in seconds when the token will expire
   */
  @column()
  declare expiresIn?: number

  /**
   * Timestamp at which the token expires
   */
  @column.dateTime({
    autoCreate: false,
    autoUpdate: false,
  })
  declare expiresAt?: DateTime

  /**
   * Provider User Id
   */
  @column()
  declare providerUserId: string

  /**
   * User relation
   */
  @column()
  declare userId: User['id']
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
