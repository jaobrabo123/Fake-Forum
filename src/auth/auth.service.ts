import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
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
    createHighEntropyString,
    createHmacSHA256Hash,
} from "../common/utils/crypto.utils";
import { SessionService } from "./session.service";
import { GoogleUser } from "./entities/google-user.entity";

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

    private async createSession(userId: string) {
        const accessToken = await this.jwtService.signAsync<AccessTokenPayload>(
            {
                sub: userId,
            },
        );

        const refreshToken = createHighEntropyString();
        const refreshTokenHash = createHmacSHA256Hash(refreshToken);

        await this.sessionService.create(userId, refreshTokenHash, {
            userId,
        });

        return {
            cookies: { accessToken, refreshToken },
        };
    }

    async login(dto: LoginDTO) {
        const user = await this.userRepository.findAuthByEmail(dto.email);
        if (!user) throw new UnauthorizedException("Credenciais inválidas.");
        if (!user.password)
            throw new BadRequestException(
                "Esta conta utiliza login com Google. Entre com o Google.",
            );

        const validPassword = await this.argon2Service.compare(
            user.password,
            dto.password,
        );
        if (!validPassword)
            throw new UnauthorizedException("Credenciais inválidas.");

        return this.createSession(user.id);
    }

    async refresh(oldRefreshToken: string | undefined) {
        if (!oldRefreshToken) {
            throw new UnauthorizedException("Refresh token ausente.");
        }

        const oldRefreshTokenHash = createHmacSHA256Hash(oldRefreshToken);

        const session = await this.sessionService.consume(oldRefreshTokenHash);
        if (!session) {
            throw new UnauthorizedException("Refresh token inválido.");
        }

        return this.createSession(session.userId);
    }

    async logout(userId: string, refreshToken?: string) {
        if (refreshToken) {
            const refreshTokenHash = createHmacSHA256Hash(refreshToken);
            await this.sessionService.remove(userId, refreshTokenHash);
        }
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

    async googleLogin(code: string, state: string, cookieState?: string) {
        if (state !== cookieState)
            throw new UnauthorizedException("Google state inválido.");

        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    code,
                    client_id:
                        this.configService.getOrThrow<string>(
                            "GOOGLE_CLIENT_ID",
                        ),
                    client_secret: this.configService.getOrThrow<string>(
                        "GOOGLE_CLIENT_SECRET",
                    ),
                    redirect_uri: this.configService.getOrThrow<string>(
                        "GOOGLE_REDIRECT_URI",
                    ),
                    grant_type: "authorization_code",
                }),
            },
        );
        if (!tokenResponse.ok) {
            throw new UnauthorizedException("Falha ao obter token do Google.");
        }
        const tokenData = (await tokenResponse.json()) as {
            access_token: string;
        };

        const userResponse = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: "Bearer " + tokenData.access_token,
                },
            },
        );
        if (!userResponse.ok) {
            throw new UnauthorizedException(
                "Falha ao obter usuário do Google.",
            );
        }
        const googlerUserData = (await userResponse.json()) as GoogleUser;

        if (!googlerUserData.email_verified) {
            throw new ForbiddenException(
                "Para logar com o Google seu email precisa estar verificado.",
            );
        }

        let user = await this.userRepository.findByEmail(googlerUserData.email);

        if (!user) {
            user = await this.userRepository.save({
                email: googlerUserData.email,
            });
        }

        return this.createSession(user.id);
    }
}
