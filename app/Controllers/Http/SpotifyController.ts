import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SpotifyService from 'App/Services/SpotifyService'
import { inject } from '@adonisjs/fold'
import {
  FetchTracksByNameResponse,
  MappedTrack,
} from 'App/Controllers/Http/beans/FetchTracksByNameResponse'

@inject()
export default class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  public async artists({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id
    const topArtists = await this.spotifyService.getArtists(userId)
    const savedArtists = await this.spotifyService.saveArtists(userId, topArtists)
    return savedArtists
  }

  public async tracks({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id
    const topTracks = await this.spotifyService.getTracks(userId)
    const mappdTracks = topTracks?.map((track) => {
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
    })
    return mappdTracks
  }

  public async trackByName({
    request,
    auth,
  }: HttpContextContract): Promise<FetchTracksByNameResponse> {
    const user = await auth.authenticate()
    const userId = user.id
    const { name } = request.qs()

    const tracks = await this.spotifyService.getTracksByName(userId, name)

    const mappedTracks: MappedTrack[] = tracks.map((track) => {
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
    })

    return {
      data: mappedTracks,
    }
  }
}
