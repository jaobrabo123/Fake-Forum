import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { AuthModule } from "../../auth/auth.module";
import { DatabaseModule } from "../../database/database.module";
import { CommentRepositoryProvider } from "./comment.repository";
import { PostModule } from "../post/post.module";
import { UserProfileModule } from "../user-profile/user-profile.module";
import { CommentValidator } from "./comment.validator";

@Module({
    imports: [AuthModule, DatabaseModule, PostModule, UserProfileModule],
    controllers: [CommentController],
    providers: [CommentService, CommentRepositoryProvider, CommentValidator],
    exports: [CommentRepositoryProvider],
})
export class CommentModule {}
