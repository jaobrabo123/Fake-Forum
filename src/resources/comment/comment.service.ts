import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import {
    COMMENT_REPOSITORY,
    type CommentRepository,
} from "./comment.repository";
import { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import { POST_REPOSITORY, type PostRepository } from "../post/post.repository";
import {
    USER_PROFILE_REPOSITORY,
    type UserProfileRepository,
} from "../user-profile/user-profile.repository";
import { CommentValidator } from "./comment.validator";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PaginationQueryDTO } from "../../common/dto/pagination-query.dto";
import {
    genMetaObject,
    paginationByQuery,
} from "../../common/utils/format.util";

@Injectable()
export class CommentService {
    constructor(
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: CommentRepository,
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
        @Inject(USER_PROFILE_REPOSITORY)
        private readonly userProfilesRepository: UserProfileRepository,
        private readonly commentValidator: CommentValidator,
    ) {}

    async create(dto: CreateCommentDto, user: AccessTokenPayload) {
        const [postExists, userProfile] = await Promise.all([
            this.postRepository.existsById(dto.postId),
            this.userProfilesRepository.findByUserId(user.sub),
        ]);

        if (!postExists) {
            throw new NotFoundException(
                "Post fornecido não existe ou não foi publicado.",
            );
        }

        this.commentValidator.canComment(userProfile);

        return await this.commentRepository.save({
            ...dto,
            userProfileId: userProfile.id,
        });
    }

    async findAllByPostId(postId: string, query: PaginationQueryDTO) {
        const pagination = paginationByQuery(query);
        const [posts, total] = await Promise.all([
            this.commentRepository.findByPostIdAndReplyToIdIsNullPaginated(
                postId,
                pagination,
            ),
            this.commentRepository.countByPostIdAndReplyToIdIsNull(postId),
        ]);

        return { content: posts, meta: genMetaObject(query, total) };
    }

    async findOne(id: string) {
        const comment = await this.commentRepository.get(id);
        if (!comment) {
            throw new NotFoundException("Comentário não encontrado.");
        }
        return comment;
    }

    async findAllByReplyToId(replyToId: string, query: PaginationQueryDTO) {
        const pagination = paginationByQuery(query);
        const [posts, total] = await Promise.all([
            this.commentRepository.findByReplyToIdPaginated(
                replyToId,
                pagination,
            ),
            this.commentRepository.countByReplyToId(replyToId),
        ]);

        return { content: posts, meta: genMetaObject(query, total) };
    }

    async update(id: string, dto: UpdateCommentDto, user: AccessTokenPayload) {
        const [comment, userProfile] = await Promise.all([
            this.commentRepository.get(id),
            this.userProfilesRepository.findByUserId(user.sub),
        ]);

        if (!comment) {
            throw new NotFoundException("Comentário não encontrado.");
        }

        this.commentValidator.canComment(userProfile, comment);

        return await this.commentRepository.save({
            ...comment,
            ...dto,
        });
    }

    async remove(id: string, user: AccessTokenPayload) {
        const [comment, userProfile] = await Promise.all([
            this.commentRepository.get(id),
            this.userProfilesRepository.findByUserId(user.sub),
        ]);

        if (!comment) {
            throw new NotFoundException("Comentário não encontrado.");
        }

        this.commentValidator.canComment(userProfile, comment);

        await this.commentRepository.remove(id);
    }
}
