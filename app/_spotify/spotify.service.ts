import { inject } from '@adonisjs/fold'
import User from '#models/user'
import { SpotifyTracksApi } from '#api/spotify/spotify_tracks.api'
import { SpotifySearchApi } from '#api/spotify/spotify_search.api'
import {
  ArtistObject,
  GetUsersTopArtistsAndTracksTypeEnum,
  SearchTypeEnum,
  TrackObject,
} from '#api/spotify/api/api'

@inject()
export default class SpotifyService {
  // TODO utility ?
  async getArtists(userId: User['id']) {
    const resp = await new SpotifyTracksApi(userId).getUsersTopArtistsAndTracks(
      GetUsersTopArtistsAndTracksTypeEnum.Artists,
      'medium_term',
      5
    )
    return resp.data.items as ArtistObject[]
  }

  async getTracks(userId: User['id']) {
    const resp = await new SpotifyTracksApi(userId).getUsersTopArtistsAndTracks(
      GetUsersTopArtistsAndTracksTypeEnum.Tracks,
      'medium_term',
      5
    )
    return resp.data.items as TrackObject[]
  }

  async getTracksByIds(userId: User['id'], trackIds: string[]) {
    const commaSeparatedIds = trackIds.join(',')
    const resp = await new SpotifyTracksApi(userId).getSeveralTracks(commaSeparatedIds)
    return resp.data.tracks
  }

  async getTracksByName(userId: User['id'], name: string) {
    const resp = await new SpotifySearchApi(userId).search(name, [SearchTypeEnum.Track])
    return resp.data.tracks?.items ?? []
  }
}
