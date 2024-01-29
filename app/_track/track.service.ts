import { inject } from '@adonisjs/fold'
import User from '#models/user'
import Track from '#models/track'
import { TrackObject } from '#api/spotify/api/api'

@inject()
export default class TrackService {
  async saveTracks(userId: User['id'], tracks: TrackObject[]) {
    for (let track of tracks) {
      const newTrack = new Track()
      newTrack.name = track.name
      newTrack.spotifyId = track.id
      newTrack.spotifyImage = track.album?.images[0].url
      newTrack.spotifyUri = track.uri
      newTrack.albumName = track.album?.name
      newTrack.userId = userId
      await newTrack.save()
    }
  }

  getTracksData(tracks: Track[]) {
    const mappdTracks = tracks?.map((track) => {
      return {
        // popularity: track.popularity,
        name: track.name,
        trackId: track.id,
        // album: track?.albun?.name,
      }
    })

    return mappdTracks
  }

  async updateFavorityTrack(userId: User['id'], trackIds: Track['id'][]) {
    // TODO ??
    const markFavorite = await Track.query()
      .where('user_id', userId)
      .whereIn('spotify_id', trackIds)

    return {
      data: markFavorite,
    }
  }
}
