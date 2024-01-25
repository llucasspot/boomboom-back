type SpotifyApiArtist = {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: 'artist'
  uri: `spotify:artist:${string}`
}

export type SpotifySearchTrackResponse = {
  tracks: {
    items: {
      album: {
        album_type: 'album'
        artists?: SpotifyApiArtist[]
        available_markets: string[]
        external_urls: string[]
        href: string
        id: string
        images?: string[]
        name?: string
        release_date: '2024-01-05'
        release_date_precision: 'day'
        total_tracks: number
        type: 'album'
        uri: `spotify:album:${string}`
      }
      artists?: SpotifyApiArtist[]
      available_markets: string[]
      disc_number: number
      duration_ms: number
      explicit: false
      external_ids: { isrc: string }
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      is_local: false
      name: string
      popularity?: number
      preview_url: string
      track_number: 5
      type: 'track'
      uri: `spotify:track:${string}`
    }[]
  }
}
