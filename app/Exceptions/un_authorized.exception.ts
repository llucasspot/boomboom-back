import { ErrorCode } from '#exceptions/beans/error_code'
import { Exception } from '@adonisjs/core/exceptions'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnAuthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
/**
 * @swagger
 * components:
 *  responses:
 *    UnAuthorizedException:
 *      description: Unauthorized access
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              errors:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "E_UNAUTHORIZED_ACCESS: Unauthorized access"
 */
export default class UnAuthorizedException extends Exception {
  constructor(message: string = ErrorCode.UN_AUTHORIZED, code: string = ErrorCode.UN_AUTHORIZED) {
    super(message, {
      code,
      status: 401,
    })
  }
}
