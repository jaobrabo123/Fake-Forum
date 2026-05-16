import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";

export interface SuccessResponseBody<T> {
    success: boolean;
    statusCode: number;
    message?: string;
    content?: T;
    meta?: {
        total?: number;
        page?: number;
        perPage?: number;
        totalPages?: number;
        cached?: boolean;
        hasNextPage?: boolean;
    };
}

export interface Meta {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
    cached?: boolean;
    hasNextPage?: boolean;
}

export interface SuccessResponseData {
    message?: string;
    content?: object | object[];
    meta?: Meta;
}

export class SuccessResponseInterceptor<T> implements NestInterceptor<
    T,
    SuccessResponseBody<any>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<SuccessResponseBody<any>> {
        const ctx = context.switchToHttp();

        const response = ctx.getResponse<Response>();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data: SuccessResponseData | undefined) => ({
                success: true,
                statusCode,
                message: data?.message,
                content: data?.content ?? data,
            })),
        );
    }
}
