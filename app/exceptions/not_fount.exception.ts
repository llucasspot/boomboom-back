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
 *    NotFountException:
 *      description: Not Fount Exception
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
 *                      example: NOT_FOUND
 *                    code:
 *                      type: string
 *                      example: NOT_FOUND
 *                  required:
 *                    - message
 *                    - code
 *            required:
 *              - errors
 */
export default class NotFountException extends Exception {
  constructor(message: string = ErrorCode.NOT_FOUND, code: string = ErrorCode.NOT_FOUND) {
    super(message, {
      code,
      status: 404,
    })
  }
}
