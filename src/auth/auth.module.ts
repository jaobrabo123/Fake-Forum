import { forwardRef, Module } from "@nestjs/common";
import { Argon2Service } from "./argon2.service";
import { AuthGuard } from "./auth.guard";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "../resources/user/user.module";
import { RedisModule } from "../redis/redis.module";
import { SessionService } from "./session.service";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow("JWT_SECRET"),
                signOptions: { expiresIn: "15m" },
            }),
        }),
        RedisModule,
    ],
    controllers: [AuthController],
    providers: [Argon2Service, AuthGuard, AuthService, SessionService],
    exports: [Argon2Service, AuthGuard, JwtModule],
})
export class AuthModule {}
