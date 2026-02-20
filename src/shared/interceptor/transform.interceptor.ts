import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Response } from 'express'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  { statusCode: number; data: T }
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ statusCode: number; data: T }> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse<Response>()

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        data,
      })),
    )
  }
}
