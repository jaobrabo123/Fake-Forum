import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Put,
} from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { AuthGuard } from "../../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "../../auth/entities/token-payload.entity";

@Controller("userprofile")
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() createUserProfileDto: CreateUserProfileDto,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        return await this.userProfileService.create(createUserProfileDto, user);
    }

    @Get()
    async findAll() {
        return await this.userProfileService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.userProfileService.findOne(id);
    }

    @Put()
    @UseGuards(AuthGuard)
    async update(
        @Body() dto: CreateUserProfileDto,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        return await this.userProfileService.update(dto, user);
    }

    @Delete()
    @UseGuards(AuthGuard)
    async remove(@CurrentUser() user: AccessTokenPayload) {
        await this.userProfileService.remove(user);
    }
}
