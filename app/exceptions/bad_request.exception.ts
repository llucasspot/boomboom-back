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
 *    BadRequestException:
 *      description: Bad Request Exception
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
 *                      example: BAD_REQUEST
 *                    code:
 *                      type: string
 *                      example: BAD_REQUEST
 *                  required:
 *                    - message
 *                    - code
 *            required:
 *              - errors
 */
export default class BadRequestException extends Exception {
  constructor(message: string = ErrorCode.BAD_REQUEST, code: string = ErrorCode.BAD_REQUEST) {
    super(message, {
      code,
      status: 400,
    })
  }
}
