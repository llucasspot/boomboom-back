/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { GuardName } from '#config/beans/guard_name'
const AuthSpotifyController = () => import('../app/auth/auth_spotify.controller.js')
const AuthController = () => import('../app/auth/auth.controller.js')
const UserController = () => import('../app/_user/user.controller.js')
const MatchController = () => import('../app/_match/match.controller.js')
const SpotifyController = () => import('../app/_spotify/spotify.controller.js')

router.get('health', ({ response }) => response.noContent())

router
  .group(() => {
    router.group(() => {
      router.get('/auth/spotify', [AuthSpotifyController, 'authorize'])
      router.get('/auth/spotify/callback', [AuthSpotifyController, 'callback'])
      router.get('/auth/success', [AuthController, 'success'])
    })

    router
      .group(() => {
        router.post('/auth/logout', [AuthController, 'logout'])
        router.get('/auth/profile', [AuthController, 'getUserInfo'])
        router.post('/auth/profile', [AuthController, 'createUserProfile'])
        router.post('/auth/profile/avatar', [AuthController, 'uploadUserAvatar'])
      })
      .use(
        middleware.auth({
          guards: [GuardName.API],
        })
      )

    router
      .group(() => {
        router.get('/users', [UserController, 'getProfiles'])
        router.get('/users/:userId/fav', [UserController, 'favUser'])
      })
      .use(
        middleware.auth({
          guards: [GuardName.API],
        })
      )

    router
      .group(() => {
        router.get('/matches/', [MatchController, 'getMatches'])
      })
      .use(
        middleware.auth({
          guards: [GuardName.API],
        })
      )

    router
      .group(() => {
        router.get('/spotify/top-five-tracks', [SpotifyController, 'getTopFiveTracks'])
        router.get('/spotify/track-by-name', [SpotifyController, 'getTrackByName'])
      })
      .use(
        middleware.auth({
          guards: [GuardName.API],
        })
      )
  })
  .prefix('api')
