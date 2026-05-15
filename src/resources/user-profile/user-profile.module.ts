import { Module } from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { UserProfileController } from "./user-profile.controller";
import { DatabaseModule } from "../../database/database.module";
import { AuthModule } from "../../auth/auth.module";
import { UserProfileRepositoryProvider } from "./user-profile.repository";

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [UserProfileController],
    providers: [UserProfileService, UserProfileRepositoryProvider],
    exports: [UserProfileRepositoryProvider],
})
export class UserProfileModule {}
