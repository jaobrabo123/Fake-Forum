import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
} from "@nestjs/common";
import { FollowService } from "./follow.service";
import { CreateFollowDTO } from "./dto/create-follow.dto";
import { AuthGuard } from "../../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { PublicFollow } from "./entities/public-follow.entity";
import { WithFollowingFollow } from "./entities/with-following-follow.entity";
import { WithFollowerFollow } from "./entities/with-follower-follow.entity";

@Controller("follow")
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: PublicFollow })
    async create(
        @Body() createFollowDto: CreateFollowDTO,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        return await this.followService.create(createFollowDto, user);
    }

    @Get("following")
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: WithFollowingFollow, isArray: true })
    async findFollowing(@CurrentUser() user: AccessTokenPayload) {
        return await this.followService.findFollowing(user);
    }

    @Get("followers")
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: WithFollowerFollow, isArray: true })
    async findFollowers(@CurrentUser() user: AccessTokenPayload) {
        return await this.followService.findFollowers(user);
    }

    @Delete("following/:followingId")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteFollowing(
        @Param("followingId") followingId: string,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        await this.followService.deleteFollowing(followingId, user);
    }
}
