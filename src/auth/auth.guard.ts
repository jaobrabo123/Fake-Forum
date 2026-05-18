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
        const accessToken =
            this.extractTokenFromHeader(request) ??
            this.extractTokenFromCookies(request);
        if (!accessToken) {
            throw new UnauthorizedException("AccessToken ausente.");
        }

        try {
            const user =
                await this.jwtService.verifyAsync<AccessTokenPayload>(
                    accessToken,
                );

            request.user = user;
        } catch (err) {
            if (err instanceof TokenExpiredError)
                throw new UnauthorizedException("AccessToken expirado.");
            throw new UnauthorizedException("AccessToken inválido.");
        }

        return true;
    }

    private extractTokenFromCookies(request: UnauthRequest) {
        return request.cookies.accessToken;
    }

    private extractTokenFromHeader(request: UnauthRequest) {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
