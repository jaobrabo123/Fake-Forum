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
import {
    PublicFollow,
    PublicFollowResponse,
} from "./entities/public-follow.entity";
import {
    WithFollowerFollow,
    WithFollowerFollowResponse,
} from "./entities/with-follower-follow.entity";
import { ApiRequireAuth } from "../../common/decorators/request/api-require-auth.decorator";
import {
    WithFollowingFollow,
    WithFollowingFollowResponse,
} from "./entities/with-following-follow.entity";

@Controller("follows")
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiCreatedResponse({ type: PublicFollowResponse })
    async create(
        @Body() createFollowDTO: CreateFollowDTO,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicFollow> {
        return await this.followService.create(createFollowDTO, user);
    }

    @Get("following")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: WithFollowingFollowResponse, isArray: true })
    async findFollowing(
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<WithFollowingFollow[]> {
        return await this.followService.findFollowing(user);
    }

    @Get("followers")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: WithFollowerFollowResponse, isArray: true })
    async findFollowers(
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<WithFollowerFollow[]> {
        return await this.followService.findFollowers(user);
    }

    @Delete("following/:followingId")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiRequireAuth()
    async deleteFollowing(
        @Param("followingId") followingId: string,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        await this.followService.deleteFollowing(followingId, user);
    }
}
