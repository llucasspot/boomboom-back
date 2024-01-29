import { inject } from '@adonisjs/fold'
import env from '#start/env'

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

@inject()
export default class ConfigurationService {
  static DEFAULT_SPOTIFY_API_URL = 'https://api.spotify.com/v1'

  static isServerInDevMode(): boolean {
    return env.get('NODE_ENV', NodeEnv.DEVELOPMENT) === NodeEnv.DEVELOPMENT
  }
}
