import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Profile from 'App/Models/Profile'
import SpotifyService from 'App/Services/SpotifyService'
import CreateProfileValidator from 'App/Validators/CreateProfileValidator'
import { inject } from '@adonisjs/fold'
import UploadAvatarValidator from 'App/Validators/UploadAvatarValidator'
import TechnicalException from 'App/Exceptions/TechnicalException'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'

@inject()
export default class ProfilesController {
  constructor(private spotifyService: SpotifyService) {}

  public async get({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id

    const profile = await Profile.query().where('user_id', userId).first()
    return {
      data: profile,
    }
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id
    const { name, dateOfBirth, description, preferedGenderId, trackIds } =
      await request.validate(CreateProfileValidator)

    //save top 4 selected tracks by user
    const favoriteTracks = await this.spotifyService.updateFavorityTrack(userId, trackIds)
    if (!favoriteTracks?.status) throw new TechnicalException('unable to update favorite tracks')

    user.name = name
    await user.save()

    const profile = (await Profile.query().where('user_id', userId).first()) ?? new Profile()
    // @ts-ignore TODO
    profile.dateOfBirth = dateOfBirth
    profile.description = description
    profile.avatar = `/uploads/${this.buildAvatarFileName(user)}`
    profile.preferedGenderId = preferedGenderId
    profile.userId = userId
    await profile.save()

    return response.created({
      data: profile,
    })
  }

  public async uploadAvatar({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate()
    const { avatar } = await request.validate(UploadAvatarValidator)
    await avatar.move(Application.tmpPath('uploads'), {
      name: this.buildAvatarFileName(user),
      overwrite: true,
    })
    return {}
  }

  private buildAvatarFileName(user: User) {
    return `${user.id}.avatar`
  }
}
