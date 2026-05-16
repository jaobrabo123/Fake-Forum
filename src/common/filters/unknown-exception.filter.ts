import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import http from "http";
import { UnauthRequest } from "../../auth/entities/unauth-request.entity";

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<UnauthRequest>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException &&
            typeof exception.getResponse() === "object"
                ? (exception.getResponse() as object)
                : {
                      error: http.STATUS_CODES[status],
                      message: "Erro desconhecido.",
                      statusCode: status,
                  };

        if (status >= 500) {
            console.error(exception);
        }

        return response.status(status).json({
            ...exceptionResponse,
            path: request.originalUrl,
            timestamp: new Date().toISOString(),
            success: false,
        });
    }
}
