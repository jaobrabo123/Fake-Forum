import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthRequest } from "../../../auth/entities/auth-request.entity";

export const CurrentUser = createParamDecorator(
    (data: keyof AuthRequest["user"], context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        return data ? request.user[data] : request.user;
    },
);
