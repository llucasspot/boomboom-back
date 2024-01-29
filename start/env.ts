/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'
import { NodeEnv } from '#services/configuration.service'
import { DatabaseConnectionName } from '#config/beans/database_connection_name'
import { LogLevel } from '#config/beans/log_level'
import { SessionDriver } from '#config/beans/session_driver'
import { HashDriverName } from '#config/beans/hash_driver_name'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum.optional(Object.values(NodeEnv)),
  PORT: Env.schema.number.optional(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string.optional({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum.optional(Object.values(LogLevel)),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum.optional(Object.values(SessionDriver)),
  TZ: Env.schema.enum(['UTC'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  // database
  DB_CONNECTION: Env.schema.enum.optional(Object.values(DatabaseConnectionName)),
  // main database connection
  DATABASE_HOST: Env.schema.string.optional({ format: 'host' }),
  DATABASE_NAME: Env.schema.string(),
  DATABASE_PASSWORD: Env.schema.string.optional(),
  DATABASE_PORT: Env.schema.number.optional(),
  DATABASE_USER: Env.schema.string.optional(),
  // divers
  HASH_DRIVER: Env.schema.enum.optional(Object.values(HashDriverName)),
  // DRIVE_DISK: Env.schema.enum.optional(Object.values(DriveDiskName)),
  // oauth providers
  SPOTIFY_CLIENT_ID: Env.schema.string(),
  SPOTIFY_CLIENT_SECRET: Env.schema.string(),
  SPOTIFY_CALLBACK_URL: Env.schema.string.optional({ format: 'url' }),
  SPOTIFY_SUCCESS_URL: Env.schema.string.optional({ format: 'url' }),
  // project
  BASE_API_URL: Env.schema.string({ format: 'url' }),
})
