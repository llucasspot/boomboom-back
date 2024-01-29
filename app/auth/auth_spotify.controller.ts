import { inject } from '@adonisjs/fold'
import SpotifyService from '../_spotify/spotify.service.js'
import TrackService from '../_track/track.service.js'
import UnAuthorizedException from '#exceptions/un_authorized.exception'
import { HttpContext } from '@adonisjs/core/http'
import { AllyService } from '@adonisjs/ally/types'
import User from '#models/user'
import Track from '#models/track'
import AuthProviders from '#models/auth_providers'
import env from '#start/env'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { DateTime } from 'luxon'
import TechnicalException from '#exceptions/technical.exception'
import { ErrorMessage } from '#exceptions/beans/error_message'

@inject()
export default class AuthSpotifyController {
  constructor(
    private spotifyService: SpotifyService,
    private trackService: TrackService
  ) {}

  /**
   * @swagger
   * /api/auth/spotify:
   *  get:
   *    tags:
   *      - Spotify OAuth
   *    responses:
   *      200:
   *        description: Success
   */
  async authorize({ ally }: HttpContext) {
    return ally.use('spotify').stateless().redirect()
  }

  private useSpotify(ally: AllyService) {
    const spotify = ally.use('spotify').stateless()
    /**
     * User has explicitly denied the login request
     */
    if (spotify.accessDenied()) {
      throw new UnAuthorizedException('Access was denied')
    }
    /**
     * Unable to verify the CSRF state
     */
    if (spotify.stateMisMatch()) {
      throw new UnAuthorizedException('Request expired. try again')
    }
    /**
     * There was an unknown error during the redirect
     */
    if (spotify.hasError()) {
      console.log('useSpotify : ', spotify.getError())
      throw new UnAuthorizedException('something went wrong with provider')
    }
    return spotify
  }

  private async useSpotifyUser(ally: AllyService) {
    const spotify = this.useSpotify(ally)
    try {
      return await spotify.user()
    } catch (err: any) {
      throw new TechnicalException(ErrorMessage.ALLY)
    }
  }

  private async initializeUserData(user: User) {
    const trackExist = await Track.query().where('user_id', user.id)
    if (!trackExist.length) {
      const topTracks = await this.spotifyService.getTracks(user.id)
      await this.trackService.saveTracks(user.id, topTracks)
    }
  }

  async callback({ ally, response }: HttpContext) {
    const { token, email, id: providerUserId, name } = await this.useSpotifyUser(ally)
    const user = await User.firstOrCreate(
      {
        email: email as string,
      },
      {
        email: email as string,
        name: name,
      }
    )
    await AuthProviders.updateOrCreate(
      {
        name: 'spotify',
        userId: user.id,
      },
      {
        accessToken: token.token,
        refreshToken: token.refreshToken,
        type: token.type,
        expiresIn: token.expiresIn,
        expiresAt: DateTime.fromJSDate(token.expiresAt),
        providerUserId,
      }
    )
    await this.initializeUserData(user)
    const authToken = await this.generateUserToken(user)
    response.redirect(this.buildSuccessUrl(authToken, user))
  }

  private buildSuccessUrl(authToken: AccessToken, user: User) {
    const url = new URL(env.get('SPOTIFY_SUCCESS_URL', `${env.get('BASE_API_URL')}/auth/success`))
    url.searchParams.append('userToken', authToken.value!.release())
    url.searchParams.append('userId', user.id)
    return url.toString()
  }

  private async generateUserToken(user: User): Promise<AccessToken> {
    return User.authTokens.create(user)
  }
}
