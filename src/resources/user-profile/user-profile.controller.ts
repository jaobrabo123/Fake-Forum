import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Put,
    HttpStatus,
    HttpCode,
} from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { AuthGuard } from "../../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { PublicUserProfile } from "./entities/public-user-profile.entity";

@Controller("userprofile")
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: PublicUserProfile })
    async create(
        @Body() createUserProfileDto: CreateUserProfileDto,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        return await this.userProfileService.create(createUserProfileDto, user);
    }

    @Get()
    @ApiOkResponse({ type: PublicUserProfile, isArray: true })
    async findAll() {
        return await this.userProfileService.findAll();
    }

    @Get(":id")
    @ApiOkResponse({ type: PublicUserProfile })
    async findOne(@Param("id") id: string) {
        return await this.userProfileService.findOne(id);
    }

    @Put()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: PublicUserProfile })
    async update(
        @Body() dto: CreateUserProfileDto,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        return await this.userProfileService.update(dto, user);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    async remove(@CurrentUser() user: AccessTokenPayload) {
        await this.userProfileService.remove(user);
    }
}
