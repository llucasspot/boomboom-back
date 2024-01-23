import { inject } from '@adonisjs/fold'
import User from 'App/Models/User'
import Match from 'App/Models/Match'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

@inject()
export default class MatchController {
  /**
   * @swagger
   * /api/matches/:
   *  get:
   *    summary: fav an user
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Match
   *    produces:
   *      - application/json
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
   *                    properties:
   *                      id:
   *                        $ref: '#/components/schemas/User/properties/id'
   *                      name:
   *                        $ref: '#/components/schemas/User/properties/name'
   *                message:
   *                  type: string
   *                  example: "Mutual match history"
   */
  public async getMatches({ auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const matches = await Match.query()
      .where('matcher_user_id', user.id)
      .orWhere('matched_user_id', user.id)

    const matchedUserIds = matches.map((match: Match) => {
      return match.matcherUserId === user.id ? match.matchedUserId : match.matcherUserId
    })

    const users = await User.query().whereIn('id', matchedUserIds).select('id', 'name')

    return {
      data: users,
      message: 'Mutual match history',
    }
  }
}