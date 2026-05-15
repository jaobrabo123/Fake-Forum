import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { PublicUser } from "./entities/public-user.entity";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiCreatedResponse({ type: PublicUser })
    async create(@Body() createUserDTO: CreateUserDTO) {
        return await this.userService.create(createUserDTO);
    }
}
