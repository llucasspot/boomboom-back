import app from '@adonisjs/core/services/app'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import TechnicalException from '#exceptions/technical.exception'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    if (error instanceof Exception) {
      return ctx.response.status(error.status).json({
        code: error.code,
        message: error.message,
      })
    }
    console.log('HttpExceptionHandler : ', error)
    const technicalException = new TechnicalException()
    return ctx.response.status(technicalException.status).json({
      code: technicalException.code,
      message: technicalException.message,
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
