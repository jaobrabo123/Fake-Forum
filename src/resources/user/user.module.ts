import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseModule } from "../../database/database.module";
import { UserRepositoryProvider } from "./user.repository";
import { AuthModule } from "../../auth/auth.module";

@Module({
    imports: [DatabaseModule, forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, UserRepositoryProvider],
    exports: [UserRepositoryProvider],
})
export class UserModule {}
