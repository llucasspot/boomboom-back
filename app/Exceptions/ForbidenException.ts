import { HttpException } from '@adonisjs/http-server/build/src/Exceptions/HttpException'
import { ErrorCode } from 'App/Exceptions/ErrorCode'

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
export default class ForbiddenException extends HttpException {
  constructor(message: string = ErrorCode.FORBIDDEN, code: string = ErrorCode.FORBIDDEN) {
    super(message, 400, code)
  }
}
