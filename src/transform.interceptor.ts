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
        const timestamp = new Date().toISOString();

        return next
            .handle()
            .pipe(
                map((data) => {
                    if (data.data && data?.meta) {
                        return {
                            success: true,
                            ...data,
                            timestamp,
                        };
                    }

                    return {
                        success: true,
                        data,
                        timestamp
                    }
                }),
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
                                timestamp
                            },
                            status
                        )
                    );
                })
            );
    }
}