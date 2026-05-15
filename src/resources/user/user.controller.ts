import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ApiResponse } from "@nestjs/swagger";
import { PublicUser } from "./entities/public-user.entity";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({ type: PublicUser })
    create(@Body() CreateUserDTO: CreateUserDTO) {
        return this.userService.create(CreateUserDTO);
    }
}
