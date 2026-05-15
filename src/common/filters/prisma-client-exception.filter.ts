import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace";
import { UnauthRequest } from "../../auth/entities/unauth-request.entity";
import type { Response } from "express";
import http from "http";

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<UnauthRequest>();

        const errorsData: Record<string, { status: number; message: string }> =
            {
                P1001: {
                    status: 503,
                    message: "Erro ao tentar acessar o banco de dados.",
                },
                P2002: {
                    status: 409,
                    message: "Violação de chave única.",
                },
                P2003: {
                    status: 400,
                    message: "Chave estrangeira inválida.",
                },
                P2025: {
                    status: 404,
                    message: "Não encontrado.",
                },
                "22P02": {
                    status: 400,
                    message: "Campo com formato inválido.",
                },
            };

        const errorData = errorsData[exception.code] ?? {
            status: 500,
            message: "Erro interno.",
        };

        if (errorData.status >= 500) {
            console.error(exception);
        }

        return response.status(errorData.status).json({
            statusCode: errorData.status,
            error: http.STATUS_CODES[errorData.status],
            message: errorData.message,
            path: request.originalUrl,
            timestamp: new Date().toISOString(),
        });
    }
}
