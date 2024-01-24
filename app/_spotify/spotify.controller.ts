import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SpotifyService from 'App/_spotify/spotify.service'
import { inject } from '@adonisjs/fold'
import {
  FetchTracksByNameResponse,
  MappedTrack,
} from 'App/_spotify/beans/FetchTracksByNameResponse'
import { SpotifySearchTrackResponse } from 'App/_spotify/beans/SpotifySearchTrackResponse'

@inject()
export default class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  /**
   * @swagger
   * components:
   *  schemas:
   *    SerializedTrack:
   *      type: object
   *      properties:
   *        uri:
   *          type: string
   *        popularity:
   *          type: number
   *        name:
   *          type: string
   *        trackId:
   *          type: string
   *        album:
   *          type: string
   *        image:
   *          type: object
   *          properties:
   *            height:
   *              type: number
   *            url:
   *              type: string
   *            width:
   *              type: number
   *        artistName:
   *          type: string
   */
  private serializeTrack(track: SpotifySearchTrackResponse['tracks']['items'][0]) {
    const artistNames = track.artists?.map((artist) => artist.name).join(', ')
    return {
      uri: track.uri,
      popularity: track.popularity,
      name: track.name,
      trackId: track.id,
      album: track?.album?.name,
      image: track?.album?.images?.[0],
      artistName: artistNames,
    }
  }

  /**
   * @swagger
   * /api/spotify/top-five-tracks:
   *  get:
   *    summary: get user spotify top five tracks
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
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/SerializedTrack'
   */
  public async getTopFiveTracks({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id
    const topTracks = await this.spotifyService.getTracks(userId)
    return topTracks?.map((track) => {
      return this.serializeTrack(track)
    })
  }

  /**
   * @swagger
   * /api/spotify/top-five-tracks:
   *  get:
   *    summary: get user spotify top five tracks
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
   *                    $ref: '#/components/schemas/SerializedTrack'
   */
  public async getTrackByName({
    request,
    auth,
  }: HttpContextContract): Promise<FetchTracksByNameResponse> {
    const user = await auth.authenticate()
    const userId = user.id
    const { name } = request.qs()

    const tracks = await this.spotifyService.getTracksByName(userId, name)

    const mappedTracks: MappedTrack[] = tracks.map((track) => {
      return this.serializeTrack(track)
    })

    return {
      data: mappedTracks,
    }
  }
}
