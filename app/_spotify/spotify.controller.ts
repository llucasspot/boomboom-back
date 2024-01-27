import { inject } from '@adonisjs/fold'
import SpotifyService from './spotify.service.js'
import { SpotifySearchTrackResponse } from './beans/spotify_search_track.response.js'
import { HttpContext } from '@adonisjs/core/http'
import { FetchTracksByNameResponse, MappedTrack } from './beans/fetch_tracks_by_name.response.js'

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
   *          format: uri
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
   *              format: uri
   *            width:
   *              type: number
   *          required:
   *            - height
   *            - url
   *            - width
   *        artistName:
   *          type: string
   *      required:
   *        - uri
   *        - popularity
   *        - name
   *        - trackId
   *        - uri
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
   *      - Spotify
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
  async getTopFiveTracks({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const userId = user.id
    const topTracks = await this.spotifyService.getTracks(userId)
    return topTracks?.map((track) => {
      return this.serializeTrack(track)
    })
  }

  /**
   * @swagger
   * /api/spotify/track-by-name:
   *  get:
   *    summary: get user spotify top five tracks
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Spotify
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
   *              required:
   *                - data
   */
  async getTrackByName({ request, auth }: HttpContext): Promise<FetchTracksByNameResponse> {
    const user = auth.getUserOrFail()
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
