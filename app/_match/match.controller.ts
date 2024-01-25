import { inject } from '@adonisjs/fold'
import { HttpContext } from '@adonisjs/core/http'
import Match from '#models/match'
import User from '#models/user'

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
  async getMatches({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

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
