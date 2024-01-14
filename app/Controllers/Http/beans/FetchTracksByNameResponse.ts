import { SpotifySearchTrackResponse } from 'App/Services/SpotifyService'

export type MappedTrack = {
  uri: SpotifySearchTrackResponse['tracks']['items'][0]['uri']
  popularity: SpotifySearchTrackResponse['tracks']['items'][0]['popularity']
  name: SpotifySearchTrackResponse['tracks']['items'][0]['name']
  trackId: SpotifySearchTrackResponse['tracks']['items'][0]['id']
  album: SpotifySearchTrackResponse['tracks']['items'][0]['album']['name']
  image?: string
  artistName?: string
}

export type FetchTracksByNameResponse = {
  data: MappedTrack[]
}
