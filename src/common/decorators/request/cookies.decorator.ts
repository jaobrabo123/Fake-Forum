import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UnauthRequest } from "../../../auth/entities/unauth-request.entity";

export const Cookies = createParamDecorator(
    (data: keyof UnauthRequest["cookies"], ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<UnauthRequest>();
        return data ? request.cookies[data] : request.cookies;
    },
);
