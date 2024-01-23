import Track from 'App/Models/Track'
import { inject } from '@adonisjs/fold'
import User from 'App/Models/User'
import { SpotifySearchTrackResponse } from 'App/_spotify/beans/SpotifySearchTrackResponse'

@inject()
export default class TrackService {
  public async saveTracks(
    userId: User['id'],
    tracks: SpotifySearchTrackResponse['tracks']['items']
  ) {
    for (let track of tracks) {
      const newTrack = new Track()
      newTrack.name = track.name
      newTrack.spotifyId = track.id
      newTrack.spotifyImage = track.href ?? track.album.href
      newTrack.spotifyUri = track.uri
      newTrack.albumName = track.album.name
      newTrack.userId = userId
      await newTrack.save()
    }
  }

  public getTracksData(tracks) {
    const mappdTracks = tracks?.map((track) => {
      return {
        popularity: track.popularity,
        name: track.name,
        trackId: track.id,
        album: track?.albun?.name,
      }
    })

    return mappdTracks
  }

  public async updateFavorityTrack(userId, trackIds) {
    // TODO ??
    const markFavorite = await Track.query()
      .where('user_id', userId)
      .whereIn('spotify_id', trackIds)

    return {
      data: markFavorite,
    }
  }
}
