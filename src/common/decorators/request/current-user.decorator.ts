import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomAuthRequest } from "../../../auth/entities/custom-request.entity";

export const CurrentUser = createParamDecorator(
    (data: keyof CustomAuthRequest["user"], context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<CustomAuthRequest>();

        return data ? request.user[data] : request.user;
    },
);
