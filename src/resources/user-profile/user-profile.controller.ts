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
import { AuthGuard } from "../../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import {
    PublicUserProfile,
    PublicUserProfileResponse,
} from "./entities/public-user-profile.entity";
import { ApiRequireAuth } from "../../common/decorators/request/api-require-auth.decorator";
import { PublicUserProfileWithTags } from "./entities/public-user-profile-with-tags.entity";
import { CreateUserProfileWithTagsDTO } from "./dto/create-user-profile-with-tags.dto";

@Controller("userprofiles")
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: PublicUserProfileResponse })
    @ApiRequireAuth()
    async create(
        @Body() createUserProfileDTO: CreateUserProfileWithTagsDTO,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicUserProfileWithTags> {
        return await this.userProfileService.create(createUserProfileDTO, user);
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: PublicUserProfileResponse, isArray: true })
    @ApiRequireAuth()
    async findAll(): Promise<PublicUserProfile[]> {
        return await this.userProfileService.findAll();
    }

    @Get("me")
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: PublicUserProfileResponse })
    @ApiRequireAuth()
    async findMe(
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicUserProfileWithTags> {
        return await this.userProfileService.findMe(user);
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: PublicUserProfileResponse })
    @ApiRequireAuth()
    async findOne(@Param("id") id: string): Promise<PublicUserProfileWithTags> {
        return await this.userProfileService.findOne(id);
    }

    @Put()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: PublicUserProfileResponse })
    @ApiRequireAuth()
    async update(
        @Body() dto: CreateUserProfileWithTagsDTO,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicUserProfileWithTags> {
        return await this.userProfileService.update(dto, user);
    }

    @Delete()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiRequireAuth()
    async remove(@CurrentUser() user: AccessTokenPayload): Promise<void> {
        await this.userProfileService.remove(user);
    }
}
