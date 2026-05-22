import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomUnauthRequest } from "../../../auth/entities/custom-request.entity";

export const Cookies = createParamDecorator(
    (data: keyof CustomUnauthRequest["cookies"], ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<CustomUnauthRequest>();
        return data ? request.cookies[data] : request.cookies;
    },
);
