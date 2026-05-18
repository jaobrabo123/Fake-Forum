import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { PostRepositoryProvider } from "./post.repository";
import { AuthModule } from "../../auth/auth.module";
import { DatabaseModule } from "../../database/database.module";
import { UserProfileModule } from "../user-profile/user-profile.module";
import { PostValidator } from "./post.validator";

@Module({
    imports: [AuthModule, DatabaseModule, UserProfileModule],
    controllers: [PostController],
    providers: [PostService, PostRepositoryProvider, PostValidator],
    exports: [PostRepositoryProvider],
})
export class PostModule {}
