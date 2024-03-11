import AuthProviders from '#models/auth_providers'
import User from '#models/user'
import { buildApiRequester } from '#utils/api.utils'
import { Configuration, SearchApi, SearchApiInterface } from 'swagger-spotify-backend'
import { BASE_PATH } from 'swagger-spotify-backend/dist/base.js'

export class SpotifySearchApi extends SearchApi implements SearchApiInterface {
  constructor(userId: User['id']) {
    const baseUrl = BASE_PATH
    super(
      new Configuration(),
      baseUrl,
      // @ts-ignore
      buildApiRequester(baseUrl, () => {
        return this.getSpotifyAccessToken(userId)
      })
    )
  }

  private async getSpotifyAccessToken(userId: User['id']) {
    const social = await AuthProviders.query().where('user_id', userId).first()
    return social?.accessToken
  }
}
