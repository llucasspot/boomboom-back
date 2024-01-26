import { inject } from '@adonisjs/fold'
import { DateTime } from 'luxon'
import Gender from '#models/gender'
import TrackService from '../_track/track.service.js'
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profile from '#models/profile'
import NotFountException from '#exceptions/not_fount.exception'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'

type UserInfo = {
  id: string
  email: string
  name: string | null
  dateOfBirth: DateTime
  description: string
  avatarUrl: string
  genderId: Gender['id']
  preferedGenderId: Gender['id']
}

@inject()
export default class AuthController {
  constructor(private trackService: TrackService) {}

  /**
   * @swagger
   * /api/auth/logout:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      200:
   *        description: Success
   */
  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.authTokens.delete(user, user.currentAccessToken.identifier)
    return {}
  }

  /**
   * in the react-native app, the webview know if the auth is success if it is redirect
   * to the url "http://.../success?userToken=..." and get the api token from the params
   */
  async success({}: HttpContext) {
    return {}
  }

  /**
   * @swagger
   * components:
   *  schemas:
   *    SerializedUser:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *        name:
   *          type: string
   *        email:
   *          type: string
   *        dateOfBirth:
   *          type: string
   *          format: date-time
   *        description:
   *          type: string
   *        avatarUrl:
   *          type: string
   *        genderId:
   *          type: string
   *        preferedGenderId:
   *          type: string
   *      required:
   *        - id
   *        - email
   *        - name
   *        - dateOfBirth
   *        - avatarUrl
   *        - genderId
   *        - preferedGenderId
   */
  private serializeUserInfo(user: User, profile: Profile) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      dateOfBirth: profile.dateOfBirth,
      description: profile.description,
      avatarUrl: profile.avatarUrl,
      genderId: profile.genderId,
      preferedGenderId: profile.preferedGenderId,
    }
  }

  /**
   * @swagger
   * /api/auth/profile:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SerializedUser'
   */
  async getUserInfo({ auth }: HttpContext): Promise<UserInfo> {
    const user = auth.getUserOrFail()
    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFountException()
    }
    return this.serializeUserInfo(user, profile)
  }

  private async updateUser(user: User, data: Pick<User, 'name'>) {
    user.name = data.name
    return user.save()
  }
  private async updateUserProfile(
    user: User,
    data: Pick<Profile, 'dateOfBirth' | 'description' | 'preferedGenderId' | 'genderId'>
  ) {
    const profile = (await Profile.query().where('user_id', user.id).first()) ?? new Profile()
    // @ts-ignore TODO error type
    profile.dateOfBirth = DateTime.fromJSDate(data.dateOfBirth)
    profile.description = data.description
    // TODO url
    profile.avatarUrl = `/uploads/${this.buildAvatarFileName(user)}`
    profile.preferedGenderId = data.preferedGenderId
    profile.genderId = data.genderId
    profile.userId = user.id
    return profile.save()
  }

  /**
   * @swagger
   * /api/auth/profile:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SerializedUser'
   */
  async createUserProfile({ auth, request, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()
    const schema = vine.object({
      name: vine.string(),
      dateOfBirth: vine.date({ formats: ['YYYY-MM-DD'] }),
      description: vine.string(),
      preferedGenderId: vine.number(),
      genderId: vine.number(),
      trackIds: vine.array(vine.string()),
    })
    const { name, trackIds, ...validatedBody } = await vine.validate({
      schema,
      data: request.body(),
    })
    await this.trackService.updateFavorityTrack(user.id, trackIds)
    const newUserData = await this.updateUser(user, { name })
    // @ts-ignore TODO see dateOfBirth
    const profile = await this.updateUserProfile(user, validatedBody)
    return response.created(this.serializeUserInfo(newUserData, profile))
  }

  /**
   * @swagger
   * /api/auth/profile/avatar:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/SerializedUser'
   */
  async uploadUserAvatar({ auth, request }: HttpContext): Promise<UserInfo> {
    const user = auth.getUserOrFail()
    const schema = vine.object({
      avatar: vine.file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg'],
      }),
    })
    console.log(request.body())
    const { avatar } = await vine.validate({
      schema,
      data: {
        avatar: request.file('avatar'),
      },
    })
    await avatar.move(app.tmpPath('uploads'), {
      name: this.buildAvatarFileName(user),
      overwrite: true,
    })
    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFountException()
    }
    return this.serializeUserInfo(user, profile)
  }

  private buildAvatarFileName(user: User) {
    return `${user.id}.avatar`
  }
}
