import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { CustomUnauthRequest } from "./entities/custom-request.entity";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { AccessTokenPayload } from "./entities/token-payload.entity";
import { SessionService } from "./session.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<CustomUnauthRequest>();

        const accessToken =
            this.extractTokenFromHeader(request) ??
            this.extractTokenFromCookies(request);
        if (!accessToken) {
            throw new UnauthorizedException("AccessToken ausente.");
        }

        try {
            const payload =
                await this.jwtService.verifyAsync<AccessTokenPayload>(
                    accessToken,
                );

            const userTokenVersion =
                await this.sessionService.findTokenVersionByUserId(payload.sub);

            if (
                userTokenVersion !== null &&
                userTokenVersion !== payload.tokenVersion
            ) {
                throw new Error();
            }

            request.user = payload;
        } catch (err) {
            if (err instanceof TokenExpiredError)
                throw new UnauthorizedException("AccessToken expirado.");
            throw new UnauthorizedException("AccessToken inválido.");
        }

        return true;
    }

    private extractTokenFromCookies(request: CustomUnauthRequest) {
        return request.cookies.accessToken;
    }

    private extractTokenFromHeader(request: CustomUnauthRequest) {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
