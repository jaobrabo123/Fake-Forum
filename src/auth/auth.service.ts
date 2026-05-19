import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
    USER_REPOSITORY,
    type UserRepository,
} from "../resources/user/user.repository";
import { LoginDTO } from "./dto/login.dto";
import { Argon2Service } from "./argon2.service";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./entities/token-payload.entity";
import { ConfigService } from "@nestjs/config";
import {
    compareRawWithHmacSHA256Hash,
    createHighEntropyString,
    createHmacSHA256Hash,
} from "../common/utils/crypto.utils";
import { SessionService } from "./session.service";

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        private readonly argon2Service: Argon2Service,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
    ) {}

    private async generateTokens(userId: string, email: string) {
        const sessionId = crypto.randomUUID();

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync<AccessTokenPayload>(
                { id: userId, email: email, sessionId },
                {
                    secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
                    expiresIn: "15m",
                },
            ),
            this.jwtService.signAsync<AccessTokenPayload>(
                { id: userId, email, sessionId },
                {
                    secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
                    expiresIn: "7d",
                },
            ),
        ]);

        const refreshTokenHash = createHmacSHA256Hash(refreshToken);

        await this.sessionService.create({
            id: sessionId,
            refreshTokenHash,
            userId,
        });

        return {
            cookies: { accessToken, refreshToken },
        };
    }

    async login(dto: LoginDTO) {
        const user = await this.userRepository.findAuthByEmail(dto.email);
        if (!user) throw new UnauthorizedException("Credenciais inválidas.");

        const validPassword = await this.argon2Service.compare(
            user.password,
            dto.password,
        );
        if (!validPassword)
            throw new UnauthorizedException("Credenciais inválidas.");

        return this.generateTokens(user.id, user.email);
    }

    async refreshTokens(oldRefreshToken: string | undefined) {
        if (!oldRefreshToken) {
            throw new UnauthorizedException("Refresh token ausente.");
        }

        try {
            const user = await this.jwtService.verifyAsync<AccessTokenPayload>(
                oldRefreshToken,
                {
                    secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
                },
            );

            const session = await this.sessionService.find(user.sessionId);
            if (!session)
                throw new UnauthorizedException("Sessão não encontrada.");

            const isTokenValid = compareRawWithHmacSHA256Hash(
                oldRefreshToken,
                session.refreshTokenHash,
            );
            if (!isTokenValid)
                throw new UnauthorizedException("Refresh token inválido.");

            await this.sessionService.remove(session.id);

            return this.generateTokens(user.id, user.email);
        } catch {
            throw new UnauthorizedException(
                "Refresh token inválido ou expirado.",
            );
        }
    }

    async logout(sessionId: string) {
        await this.sessionService.remove(sessionId);
    }

    google() {
        const googleState = createHighEntropyString();

        const params = new URLSearchParams({
            client_id: this.configService.getOrThrow("GOOGLE_CLIENT_ID"),
            redirect_uri: this.configService.getOrThrow("GOOGLE_REDIRECT_URI"),
            response_type: "code",
            scope: "openid email profile",
            state: googleState,
        });

        return {
            googleState,
            redirectUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
        };
    }
}
