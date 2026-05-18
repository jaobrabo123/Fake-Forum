import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { PublicUser, PublicUserResponse } from "./entities/public-user.entity";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiCreatedResponse({ type: PublicUserResponse })
    async create(@Body() createUserDTO: CreateUserDTO): Promise<PublicUser> {
        return await this.userService.create(createUserDTO);
    }
}
