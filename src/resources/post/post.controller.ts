import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Put,
    HttpCode,
    HttpStatus,
    Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDTO } from "./dto/create-post.dto";
import { CurrentUser } from "../../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import { AuthGuard } from "../../auth/auth.guard";
import { ApiRequireAuth } from "../../common/decorators/request/api-require-auth.decorator";
import {
    PublicPost,
    PublicPostResponse,
    PublicPostResponseWithMeta,
} from "./entities/public-post.entity";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { FindPostsQueryDTO } from "./dto/find-posts-query.dto";
import { Meta } from "../../common/interceptors/entities/meta.entity";
import { PaginationQueryDTO } from "../../common/dto/pagination-query.dto";

@Controller("posts")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ type: PublicPostResponse })
    @ApiRequireAuth()
    async create(
        @Body() createPostDTO: CreatePostDTO,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicPost> {
        return await this.postService.create(createPostDTO, user);
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicPostResponseWithMeta })
    async findAll(
        @Query() query: FindPostsQueryDTO,
    ): Promise<{ content: PublicPost[]; meta: Meta }> {
        return await this.postService.findAll(query);
    }

    @Get("recommended")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicPostResponseWithMeta })
    async findRecommended(
        @Query() query: PaginationQueryDTO,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<{ content: PublicPost[]; meta: Meta }> {
        return await this.postService.findRecommended(query, user);
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicPostResponse })
    async findOne(@Param("id") id: string): Promise<PublicPost> {
        return await this.postService.findOne(id);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicPostResponse })
    async update(
        @Param("id") id: string,
        @Body() updatePostDTO: CreatePostDTO,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicPost> {
        return await this.postService.update(id, updatePostDTO, user);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param("id") id: string,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<void> {
        await this.postService.remove(id, user);
    }
}
