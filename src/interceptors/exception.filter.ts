import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from "@nestjs/common"
import { Response } from "express"

/**
 * A filter to handle HTTP exceptions not otherwise handled by controllers
 */
@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const res: Response = host.switchToHttp().getResponse()

    res.status(exception.getStatus()).json({
      success: false,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      data: {
        exception: {
          name: exception.name,
          message: exception.message
        }
      }
    })
  }
}
