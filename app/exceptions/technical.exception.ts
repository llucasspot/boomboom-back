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
| new TechnicalException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class TechnicalException extends Exception {
  constructor(
    message: string = ErrorCode.TECHNICAL_ERROR,
    code: string = ErrorCode.TECHNICAL_ERROR
  ) {
    super(message, {
      code,
      status: 500,
    })
  }
}
