import { Module } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { FollowController } from "./follow.controller";
import { DatabaseModule } from "../../database/database.module";
import { AuthModule } from "../../auth/auth.module";
import { FollowRepositoryProvider } from "./follow.repository";
import { UserProfileModule } from "../user-profile/user-profile.module";
import { FollowValidator } from "./follow.validator";

@Module({
    imports: [DatabaseModule, AuthModule, UserProfileModule],
    controllers: [FollowController],
    providers: [FollowService, FollowRepositoryProvider, FollowValidator],
    exports: [FollowRepositoryProvider],
})
export class FollowModule {}
