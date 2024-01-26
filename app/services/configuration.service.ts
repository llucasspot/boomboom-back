import { inject } from '@adonisjs/fold'
import env from '#start/env'

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

@inject()
export default class ConfigurationService {
  DEFAULT_SPOTIFY_API_URL = 'https://api.spotify.com/v1'

  getSpotifyApiUrl(): string {
    return env.get('SPOTIFY_API_URL', this.DEFAULT_SPOTIFY_API_URL)
  }

  static isServerInDevMode(): boolean {
    return env.get('NODE_ENV', NodeEnv.DEVELOPMENT) === NodeEnv.DEVELOPMENT
  }
}
