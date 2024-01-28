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
import { MultipartFile } from '@adonisjs/bodyparser'
import Image, { ImageType } from '#models/image'

type UserInfo = {
  id: string
  name: string | null
  dateOfBirth: DateTime
  description: string
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
   *    operationId: logout
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
   *        dateOfBirth:
   *          type: string
   *          format: date-time
   *        description:
   *          type: string
   *        genderId:
   *          type: number
   *        preferedGenderId:
   *          type: number
   *      required:
   *        - id
   *        - name
   *        - dateOfBirth
   *        - genderId
   *        - preferedGenderId
   */
  private serializeUserInfo(user: User, profile: Profile) {
    return {
      id: user.id,
      name: user.name,
      dateOfBirth: profile.dateOfBirth,
      description: profile.description,
      genderId: profile.genderId,
      preferedGenderId: profile.preferedGenderId,
    }
  }

  /**
   * @swagger
   * /api/auth/profile:
   *  get:
   *    operationId: getProfile
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
    profile.preferedGenderId = data.preferedGenderId
    profile.genderId = data.genderId
    profile.userId = user.id
    return profile.save()
  }

  /**
   * @swagger
   * /api/auth/profile:
   *  post:
   *    operationId: createProfile
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                $ref: '#/components/schemas/Profile/properties/name'
   *              dateOfBirth:
   *                $ref: '#/components/schemas/Profile/properties/dateOfBirth'
   *              description:
   *                $ref: '#/components/schemas/Profile/properties/description'
   *              preferedGenderId:
   *                $ref: '#/components/schemas/Profile/properties/preferedGenderId'
   *              genderId:
   *                $ref: '#/components/schemas/Profile/properties/genderId'
   *              trackIds:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Track/properties/id'
   *            required:
   *              - name
   *              - dateOfBirth
   *              - description
   *              - preferedGenderId
   *              - genderId
   *              - trackIds
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
   *    operationId: uploadAvatar
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    requestBody:
   *      content:
   *        multipart/form-data:
   *          schema:
   *            type: object
   *            properties:
   *              avatar:
   *                description: Image file to upload as the user's avatar
   *                type: string
   *                format: binary
   *            required:
   *              - avatar
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
    const avatarValidator = vine.compile(
      vine.object({
        avatar: vine.file({
          size: '5mb',
          extnames: ['jpg', 'png', 'jpeg'],
        }),
      })
    )
    const { avatar } = await request.validateUsing(avatarValidator)
    await this.saveUserAvatarImage(user, avatar)
    const profile = await Profile.query().where('user_id', user.id).first()
    if (!profile) {
      throw new NotFountException()
    }
    return this.serializeUserInfo(user, profile)
  }

  private buildAvatarFileName(user: User, file: MultipartFile) {
    return `${user.id}.avatar.${file.extname}`
  }

  private async saveUserAvatarImage(user: User, file: MultipartFile): Promise<void> {
    const fileName = this.buildAvatarFileName(user, file)
    await file.move(app.makePath('uploads'), {
      name: fileName,
      overwrite: true,
    })
    const image = new Image()
    image.userId = user.id
    image.type = ImageType.AVATAR
    image.fileName = fileName

    // TODO Sharp not working
    //  error : Could not load the "sharp" module using the darwin-arm64 runtime
    // const sharpedImage = Sharp(file.tmpPath)
    // const metadata = await sharpedImage.metadata()
    // image.width = metadata.width
    // image.height = metadata.height

    await image.save()
  }

  /**
   * @swagger
   * /api/auth/profile/avatar:
   *  get:
   *    operationId: getAvatar
   *    summary: Get user avatar image
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Auth
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      404:
   *        $ref: '#/components/responses/NotFountException'
   *      200:
   *        description: Returns the user avatar image
   *        content:
   *          image/jpeg:
   *            schema:
   *              type: string
   *              format: binary
   */
  async getUserAvatar({ auth, response }: HttpContext): Promise<void> {
    const user = auth.getUserOrFail()
    const image = await Image.query()
      .where('user_id', user.id)
      .where('type', ImageType.AVATAR)
      .first()
    if (!image) {
      throw new NotFountException()
    }
    const absolutePath = app.makePath('uploads', image.fileName)
    return response.download(absolutePath)
  }
}
