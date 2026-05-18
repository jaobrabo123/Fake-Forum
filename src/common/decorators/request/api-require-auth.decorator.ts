import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";

export function ApiRequireAuth() {
    return applyDecorators(ApiBearerAuth(), ApiCookieAuth());
}
