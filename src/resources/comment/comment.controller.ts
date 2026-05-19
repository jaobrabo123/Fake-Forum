import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Put,
    Query,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthGuard } from "../../auth/auth.guard";
import { CurrentUser } from "../../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import {
    PublicComment,
    PublicCommentResponse,
    PublicCommentResponseWithMeta,
} from "./entities/public-comment.entity";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PaginationQueryDTO } from "../../common/dto/pagination-query.dto";
import { Meta } from "../../common/interceptors/entities/meta.entity";
import { ApiRequireAuth } from "../../common/decorators/request/api-require-auth.decorator";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";

@Controller("comments")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiCreatedResponse({ type: PublicCommentResponse })
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicComment> {
        return await this.commentService.create(createCommentDto, user);
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: PublicCommentResponse })
    @ApiRequireAuth()
    async findOne(@Param("id") id: string): Promise<PublicComment> {
        return await this.commentService.findOne(id);
    }

    @Get(":id/replies")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicCommentResponseWithMeta })
    async findAllByReplyToId(
        @Param("id") id: string,
        @Query() query: PaginationQueryDTO,
    ): Promise<{ content: PublicComment[]; meta: Meta }> {
        return await this.commentService.findAllByReplyToId(id, query);
    }

    @Get("post/:postId")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicCommentResponseWithMeta })
    async findAllByPostId(
        @Param("postId") postId: string,
        @Query() query: PaginationQueryDTO,
    ): Promise<{ content: PublicComment[]; meta: Meta }> {
        return await this.commentService.findAllByPostId(postId, query);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: PublicCommentResponse })
    async update(
        @Param("id") id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<PublicComment> {
        return await this.commentService.update(id, updateCommentDto, user);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param("id") id: string,
        @CurrentUser() user: AccessTokenPayload,
    ): Promise<void> {
        return await this.commentService.remove(id, user);
    }
}
