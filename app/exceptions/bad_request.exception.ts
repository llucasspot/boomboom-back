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
import { ErrorCode } from '#exceptions/beans/error_code'
import { Exception } from '@adonisjs/core/exceptions'

export default class BadRequestException extends Exception {
  constructor(message: string = ErrorCode.BAD_REQUEST, code: string = ErrorCode.BAD_REQUEST) {
    super(message, {
      code,
      status: 400,
    })
  }
}
