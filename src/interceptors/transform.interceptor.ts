import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import Http from "src/utils/Http"

/**
 * Standard format for HTTP responses to follow after passing through the
 * TransformInterceptor.
 */
export interface IResponse<T> {
  success: boolean
  statusCode: number
  statusMessage: string
  data: T
}

/**
 * An interceptor to transform HTTP responses to match a standard format.
 */
@Injectable()
export default class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IResponse<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode
    const success = statusCode >= 200 && statusCode < 300

    return next.handle().pipe(
      map(data => ({
        success,
        statusCode,
        statusMessage: Http.getStatusMessage(statusCode),
        data: data ?? {}
      }))
    )
  }
}
