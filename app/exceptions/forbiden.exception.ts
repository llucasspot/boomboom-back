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
 *    ForbiddenException:
 *      description: Forbidden Exception
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
 *                      example: FORBIDDEN
 *                    code:
 *                      type: string
 *                      example: FORBIDDEN
 *                  required:
 *                    - message
 *                    - code
 *            required:
 *              - errors
 */
export default class ForbiddenException extends Exception {
  constructor(message: string = ErrorCode.FORBIDDEN, code: string = ErrorCode.FORBIDDEN) {
    super(message, {
      code,
      status: 403,
    })
  }
}
