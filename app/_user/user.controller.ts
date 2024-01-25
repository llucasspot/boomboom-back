import { inject } from '@adonisjs/fold'
import UserService from './user.service.js'
import BadRequestException from '#exceptions/bad_request.exception'
import { ErrorMessage } from '#exceptions/beans/error_message'
import User from '#models/user'
import NotFountException from '#exceptions/not_fount.exception'
import MatchRequest from '#models/match_request'
import ForbiddenException from '#exceptions/forbiden.exception'
import { HttpContext } from '@adonisjs/core/http'
import Match from '#models/match'

@inject()
export default class UserController {
  constructor(private userService: UserService) {}

  /**
   * @swagger
   * /api/users/{userId}/fav:
   *  get:
   *    summary: fav an user
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - User
   *    parameters:
   *      - in: path
   *        name: userId
   *        required: true
   *        description: User id
   *        schema:
   *          type: string
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      404:
   *        $ref: '#/components/responses/NotFountException'
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  example: "It's a mutual match"
   */
  async favUser({ auth, params: { userId: requestedId } }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.id === requestedId) {
      throw new BadRequestException(ErrorMessage.SELF_FAV)
    }
    const userExist = await User.query().where('id', requestedId).first()
    if (!userExist) {
      throw new NotFountException()
    }

    const matchRequestExist = await MatchRequest.query()
      .where('matcher_user_id', requestedId)
      .where('matched_user_id', user.id)
      .first()

    if (!matchRequestExist) {
      const matchRequest = new MatchRequest()
      matchRequest.matcherUserId = user.id
      matchRequest.matchedUserId = requestedId
      await matchRequest.save()
      return {
        message: 'Match has been marked.',
      }
    }

    await matchRequestExist.delete()
    const newMatch = new Match()
    newMatch.matcherUserId = user.id
    newMatch.matchedUserId = requestedId
    await newMatch.save()
    return {
      message: "It's a mutual match",
    }
  }

  /**
   * @swagger
   * /api/users:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - User
   *    responses:
   *      401:
   *        $ref: '#/components/responses/UnAuthorizedException'
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                data:
   *                  type: array
   *                  items:
   *                    $ref: '#/components/schemas/ProfileToShow'
   */
  async getProfiles({ auth }: HttpContext) {
    const authUser = auth.getUserOrFail()
    const user = await User.query().where('id', authUser.id).preload('profile').first()
    const userProfile = user?.profile
    if (!userProfile) {
      throw new ForbiddenException(ErrorMessage.PROFILE_NOT_SET)
    }

    const data = await this.userService.getProfilesToShowForProfile(userProfile)
    return {
      data,
    }
  }
}
