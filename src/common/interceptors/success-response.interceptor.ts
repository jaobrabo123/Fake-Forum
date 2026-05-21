import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";
import { Meta } from "./entities/meta.entity";
import { SuccessResponseBody } from "./entities/success-response-body.entity";
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
                timestamp: new Date().toISOString(),
                message: data?.message,
                content: data?.content ?? data,
                meta: data?.meta,
            })),
        );
    }
}
