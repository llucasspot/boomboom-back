import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { inject } from '@adonisjs/fold'
import ConfigurationService from '#services/configuration.service'
import AuthProviders from '#models/auth_providers'
import User from '#models/user'
import { SpotifySearchTrackResponse } from './beans/spotify_search_track.response.js'
import UnAuthorizedException from '#exceptions/un_authorized.exception'
import TechnicalException from '#exceptions/technical.exception'

@inject()
export default class SpotifyService {
  private axiosInstance = this.buildAxiosInstance()

  constructor(private configurationService: ConfigurationService) {}

  private async buildOptionsWithAuthorization(
    userId: User['id'],
    { headers, ...options }: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> {
    const accessToken = await this.getSpotifyAccessToken(userId)
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
      ...options,
    }
  }

  private buildAxiosInstance(): AxiosInstance {
    const axiosInstance = axios.create({
      baseURL: this.configurationService.getSpotifyApiUrl(),
      timeout: 1000,
    })
    axiosInstance.interceptors.response.use(
      (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response
      },
      // TODO clean with adonis design pattern
      (error) => {
        if (error?.response?.status === 401) {
          throw new UnAuthorizedException()
        }
        throw new TechnicalException()
      }
    )
    return axiosInstance
  }

  private async getSpotifyAccessToken(userId: User['id']) {
    const social = await AuthProviders.query().where('user_id', userId).first()
    return social?.accessToken
  }

  // TODO utility ?
  async getArtists(userId: User['id']) {
    const resp = await this.axiosInstance.get(
      '/me/top/artists',
      await this.buildOptionsWithAuthorization(userId)
    )
    return resp?.data?.items
  }

  async getTracks(userId: User['id']): Promise<SpotifySearchTrackResponse['tracks']['items']> {
    const resp = await this.axiosInstance.get<SpotifySearchTrackResponse['tracks']>(
      '/me/top/tracks?time_range=medium_term&limit=5',
      await this.buildOptionsWithAuthorization(userId)
    )
    return resp.data.items
  }

  async getTracksByIds(userId: User['id'], trackIds: string[]) {
    const commaSeparatedIds = trackIds.join(',')
    const resp = await this.axiosInstance.get(
      `/tracks?ids=${commaSeparatedIds}`,
      await this.buildOptionsWithAuthorization(userId)
    )
    return resp.data.tracks
  }

  async getTracksByName(
    userId: User['id'],
    name: string
  ): Promise<SpotifySearchTrackResponse['tracks']['items']> {
    const resp = await this.axiosInstance.get<SpotifySearchTrackResponse>(
      `/search?q=track:${name}&type=track`,
      await this.buildOptionsWithAuthorization(userId)
    )
    return resp.data.tracks.items
  }
}
