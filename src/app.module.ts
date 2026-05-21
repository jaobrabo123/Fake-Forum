import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./resources/user/user.module";
import { AuthModule } from "./auth/auth.module";
import { UserProfileModule } from "./resources/user-profile/user-profile.module";
import { FollowModule } from "./resources/follow/follow.module";
import { PostModule } from "./resources/post/post.module";
import { RedisModule } from "./redis/redis.module";
import { CommentModule } from "./resources/comment/comment.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                throttlers: [
                    {
                        name: "general",
                        ttl: 1 * 60 * 1000,
                        limit: 100,
                    },
                ],
                storage: new ThrottlerStorageRedisService({
                    host: configService.getOrThrow<string>("REDIS_HOST"),
                    port: configService.getOrThrow<number>("REDIS_PORT"),
                    password: configService.get<string>("REDIS_PASSWORD"),
                }),
            }),
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
        UserProfileModule,
        FollowModule,
        PostModule,
        RedisModule,
        CommentModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
