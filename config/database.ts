import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import {
  DatabaseConnectionDefaultPort,
  DatabaseConnectionName,
} from '#config/beans/database_connection_name'
import env from '#start/env'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION', DatabaseConnectionName.MY_SQL),
  connections: {
    [DatabaseConnectionName.MY_SQL]: {
      client: 'mysql2',
      connection: {
        host: env.get('DATABASE_HOST', '0.0.0.0'),
        port: env.get(
          'DATABASE_PORT',
          DatabaseConnectionDefaultPort[DatabaseConnectionName.MY_SQL]
        ),
        user: env.get('DATABASE_USER', 'root'),
        password: env.get('DATABASE_PASSWORD', ''),
        database: env.get('DATABASE_NAME'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: !app.inProduction,
    },
    [DatabaseConnectionName.SQLITE]: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
