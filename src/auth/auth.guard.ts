import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { UnauthRequest } from "./entities/unauth-request.entity";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { AccessTokenPayload } from "./entities/token-payload.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<UnauthRequest>();
        const authData = this.extractAuthDataFromCookies(request);
        if (!authData.accessToken)
            throw new UnauthorizedException("AccessToken ausente.");

        try {
            const user = await this.jwtService.verifyAsync<AccessTokenPayload>(
                authData.accessToken,
            );

            request.user = user;
        } catch (err) {
            if (err instanceof TokenExpiredError)
                throw new UnauthorizedException("AccessToken expirado.");
            throw new UnauthorizedException("AccessToken inválido.");
        }

        return true;
    }

    private extractAuthDataFromCookies(request: UnauthRequest) {
        const { accessToken } = request.cookies;
        return { accessToken };
    }
}
