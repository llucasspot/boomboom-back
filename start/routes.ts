/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuthMiddleware from 'App/Middleware/Auth'

Route.get('health', ({ response }) => response.noContent())

Route.group(() => {
  Route.group(() => {
    Route.get('/auth/spotify', 'authSpotify.controller.authorize')
    Route.get('/auth/spotify/callback', 'authSpotify.controller.callback')
    Route.get('/auth/success', 'auth.controller.success')
  }).namespace('App/auth')

  Route.group(() => {
    Route.post('/auth/logout', 'auth.controller.logout')
    Route.get('/auth/profile', 'auth.controller.getUserInfo')
    Route.post('/auth/profile', 'auth.controller.createUserProfile')
    Route.post('/auth/profile/avatar', 'auth.controller.uploadUserAvatar')
  })
    .namespace('App/auth')
    .middleware(AuthMiddleware.buildMiddlewareName('api'))

  Route.group(() => {
    Route.get('/users', 'user.controller.getProfiles')
    Route.get('/users/:userId/fav', 'user.controller.favUser')
  })
    .namespace('App/_user')
    .middleware(AuthMiddleware.buildMiddlewareName('api'))

  Route.group(() => {
    Route.get('/matches/', 'match.controller.getMatches')
  })
    .namespace('App/_match')
    .middleware(AuthMiddleware.buildMiddlewareName('api'))

  Route.group(() => {
    Route.get('/spotify/top-five-tracks', 'spotify.controller.getTopFiveTracks')
    Route.get('/spotify/track-by-name', 'spotify.controller.getTrackByName')
  })
    .namespace('App/_spotify')
    .middleware(AuthMiddleware.buildMiddlewareName('api'))
}).prefix('api')
