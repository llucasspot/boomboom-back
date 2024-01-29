import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import User from '#models/user'
import { faker } from '@faker-js/faker'
import Profile from '#models/profile'
import { DateTime } from 'luxon'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Track from '#models/track'

async function createAccount() {
  const user = await User.create({
    name: faker.internet.userName(),
    email: faker.internet.email(),
  })

  await Profile.create({
    dateOfBirth: DateTime.fromJSDate(faker.date.birthdate()),
    description: faker.person.bio(),
    preferedGenderId: 1,
    genderId: 2,
    userId: user.id,
  })
  const trackDatas: Partial<ModelAttributes<InstanceType<typeof Track>>>[] = [
    {
      name: 'Minimum',
      albumName: 'Lines',
      spotifyUri: 'spotify:track:4n5DRMfFBNJNec1JApfILt',
      spotifyImage: 'https://i.scdn.co/image/ab67616d0000b273996bd95c479350f13396d9b2',
      spotifyId: '4n5DRMfFBNJNec1JApfILt',
      userId: user.id,
    },
    {
      name: 'You Sigh',
      albumName: 'Lines',
      spotifyUri: 'spotify:track:38vsMOGABG97FQGRN2Yc4z',
      spotifyImage: 'https://i.scdn.co/image/ab67616d0000b273996bd95c479350f13396d9b2',
      spotifyId: '38vsMOGABG97FQGRN2Yc4z',
      userId: user.id,
    },
    {
      name: 'Headlights',
      albumName: 'Permanent Way',
      spotifyUri: 'spotify:track:3IHdzl5BgvBJCScbAC8BPH',
      spotifyImage: 'https://i.scdn.co/image/ab67616d0000b27318eaebb6093f4f691be63c8e',
      spotifyId: '3IHdzl5BgvBJCScbAC8BPH',
      userId: user.id,
    },
    {
      name: 'Downpour',
      albumName: 'Frame',
      spotifyUri: 'spotify:track:3XD0dzwEnvqYz31gCT4jch',
      spotifyImage: 'https://i.scdn.co/image/ab67616d0000b27341b492fb3de74a1d2450fed1',
      spotifyId: '3XD0dzwEnvqYz31gCT4jch',
      userId: user.id,
    },
    {
      name: "Don't Go Far",
      albumName: 'Permanent Way',
      spotifyUri: 'spotify:track:2BfvdgdBqLtwAzvgtZq9hb',
      spotifyImage: 'https://api.spotify.com/v1/tracks/2BfvdgdBqLtwAzvgtZq9hb',
      spotifyId: '2BfvdgdBqLtwAzvgtZq9hb',
      userId: user.id,
    },
  ]
  for (const tracksdata of trackDatas) await Track.create(tracksdata)
}

export default class extends BaseSeeder {
  async run() {
    if (app.inDev) {
      await createAccount()
      await createAccount()
      await createAccount()
      await createAccount()
      await createAccount()
    }
  }
}
