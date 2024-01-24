import { inject } from '@adonisjs/fold'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import NotFountException from 'App/Exceptions/NotFountException'
import Match from 'App/Models/Match'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ErrorMessage } from 'App/Exceptions/ErrorMessage'
import MatchRequest from 'App/Models/MatchRequest'
import ForbiddenException from 'App/Exceptions/ForbidenException'
import UserService from 'App/_user/user.service'

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
  public async favUser({ auth, params: { userId: requestedId } }: HttpContextContract) {
    const user = await auth.authenticate()

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
  public async getProfiles({ auth }: HttpContextContract) {
    const authUser = await auth.authenticate()
    const user = await User.query().where('id', authUser.id).preload('profile').first()
    const userProfile = user?.profile
    if (!userProfile) {
      throw new ForbiddenException(ErrorMessage.PROFILE_NOT_SET)
    }

    return await this.userService.getProfilesToShowForProfile(userProfile)
  }
}
