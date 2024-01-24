import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import Profile from 'App/Models/Profile'
import NotFountException from 'App/Exceptions/NotFountException'
import { DateTime } from 'luxon'
import Gender from 'App/Models/Gender'
import UploadAvatarValidator from 'App/Validators/UploadAvatarValidator'
import Application from '@ioc:Adonis/Core/Application'
import User from 'App/Models/User'
import CreateProfileValidator from 'App/Validators/CreateProfileValidator'
import TrackService from 'App/_track/track.service'

type UserInfo = {
  id: string
  email: string
  name: string
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
  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {}
  }

  /**
   * in the react-native app, the webview know if the auth is success if it is redirect
   * to the url "http://.../success?userToken=..." and get the api token from the params
   */
  public async success({}: HttpContextContract) {
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
  public async getUserInfo({ auth }: HttpContextContract): Promise<UserInfo> {
    const user = await auth.authenticate()
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
    // @ts-ignore TODO
    profile.dateOfBirth = data.dateOfBirth
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
  public async createUserProfile({ auth, request, response }: HttpContextContract): Promise<void> {
    const user = await auth.authenticate()
    const { name, trackIds, ...validatedBody } = await request.validate(CreateProfileValidator)
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
  public async uploadUserAvatar({ auth, request }: HttpContextContract): Promise<UserInfo> {
    const user = await auth.authenticate()
    const { avatar } = await request.validate(UploadAvatarValidator)
    await avatar.move(Application.tmpPath('uploads'), {
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
