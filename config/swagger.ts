import { SwaggerConfig } from 'adonisjs-6-swagger'

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: 'docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/swagger.json',

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Application with swagger docs',
        version: '1.0.0',
        description: 'My application with swagger docs',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        // Because i use properties fields in $ref like : $ref: '#/components/schemas/User/properties/id'
        //   @openapitools/openapi-generator-cli think that a Id schema object exists but will not generate it.
        // So it leeds to bugs in frontend swagger beans generation.
        // To fix that we need to tell here all the $ref properties
        schemas: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
        },
      },
    },

    apis: ['app/**/*.ts', 'docs/swagger/**/*.yml', 'start/routes.ts'],
    basePath: '/',
  },
  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json',
} as SwaggerConfig
