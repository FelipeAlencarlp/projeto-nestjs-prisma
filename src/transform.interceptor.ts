import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException
} from "@nestjs/common";
import { Observable, map, throwError } from "rxjs";
import { catchError, timestamp } from "rxjs/operators";

export interface Response<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    success: true,
                    data: data,
                    timestamp: new Date().toISOString()
                })),
                catchError((err) => {
                    const status = err.status || 500;

                    const errResponse = err.response || {
                        message: err.message || 'Erro interno'
                    };

                    return throwError(() =>
                        new HttpException(
                            {
                                success: false,
                                error: errResponse,
                                timestamp: new Date().toISOString()
                            },
                            status
                        )
                    );
                })
            );
    }
}