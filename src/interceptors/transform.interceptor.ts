import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common"
import { Response } from "express"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

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
    const res: Response = context.switchToHttp().getResponse()

    return next.handle().pipe(
      map(data => ({
        success: res.statusCode >= 200 && res.statusCode < 300,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        data: data ?? {}
      }))
    )
  }
}
