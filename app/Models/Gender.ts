import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum GenderName {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Gender:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
export default class Gender extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: GenderName

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
