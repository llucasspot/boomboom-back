import { inject } from '@adonisjs/fold'
import Profile from '#models/profile'

@inject()
export default class UserService {
  /**
   * @swagger
   * components:
   *  schemas:
   *    ProfileToShow:
   *      type: object
   *      properties:
   *        user:
   *          type: object
   *          properties:
   *            id:
   *              $ref: '#/components/schemas/User/properties/id'
   *            name:
   *              $ref: '#/components/schemas/User/properties/name'
   *            image:
   *              type: string
   *          required:
   *            - id
   *            - name
   *        songs:
   *          type: array
   *          items:
   *            $ref: '#/components/schemas/Track'
   *      required:
   *        - user
   *        - songs
   */
  private serializeProfileToShow(profile: Profile) {
    return {
      user: {
        id: profile.user.id,
        name: profile.user.name,
        image: profile.avatarUrl,
      },
      songs: profile.user.tracks,
    }
  }

  async getProfilesToShowForProfile(profile: Profile) {
    // TODO add localisation feature
    const profiles = await Profile.query()
      .where('gender_id', profile.preferedGenderId)
      .whereNot('id', profile.id)
      .preload('user', (q) => {
        q.preload('tracks')
      })

    return profiles.map((_profile: Profile) => {
      return this.serializeProfileToShow(_profile)
    })
  }
}
