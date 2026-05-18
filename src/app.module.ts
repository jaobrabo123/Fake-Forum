import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./resources/user/user.module";
import { AuthModule } from "./auth/auth.module";
import { UserProfileModule } from "./resources/user-profile/user-profile.module";
import { FollowModule } from "./resources/follow/follow.module";
import { PostModule } from "./resources/post/post.module";
import { RedisModule } from "./redis/redis.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        UserModule,
        AuthModule,
        UserProfileModule,
        FollowModule,
        PostModule,
        RedisModule,
    ],
})
export class AppModule {}
