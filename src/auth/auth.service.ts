import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
    USER_REPOSITORY,
    type UserRepository,
} from "../resources/user/user.repository";
import { LoginDTO } from "./dto/login.dto";
import { Argon2Service } from "./argon2.service";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "./entities/token-payload.entity";

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        private readonly argon2Service: Argon2Service,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDTO) {
        const user = await this.userRepository.findAuthByEmail(dto.email);
        if (!user) throw new UnauthorizedException("Credenciais inválidas.");

        const validPassword = await this.argon2Service.compare(
            user.password,
            dto.password,
        );
        if (!validPassword)
            throw new UnauthorizedException("Credenciais inválidas.");

        const accessToken = await this.jwtService.signAsync<AccessTokenPayload>(
            {
                id: user.id,
                email: user.email,
            },
        );

        return {
            cookies: { accessToken },
        };
    }
}
