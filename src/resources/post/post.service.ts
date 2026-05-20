import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDTO } from "./dto/create-post.dto";
import { POST_REPOSITORY, type PostRepository } from "./post.repository";
import { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import {
    USER_PROFILE_REPOSITORY,
    type UserProfileRepository,
} from "../user-profile/user-profile.repository";
import { PostValidator } from "./post.validator";
import { FindPostsQueryDTO } from "./dto/find-posts-query.dto";
import {
    genMetaObject,
    paginationByQuery,
} from "../../common/utils/format.util";
import { PaginationQueryDTO } from "../../common/dto/pagination-query.dto";

@Injectable()
export class PostService {
    constructor(
        @Inject(POST_REPOSITORY)
        private readonly postRepository: PostRepository,
        @Inject(USER_PROFILE_REPOSITORY)
        private readonly userProfileRepository: UserProfileRepository,
        private readonly postValidator: PostValidator,
    ) {}

    async create(dto: CreatePostDTO, user: AccessTokenPayload) {
        const userProfile = await this.userProfileRepository.findByUserId(
            user.id,
        );

        // * Valido se tem perfil e se está ativo
        this.postValidator.canManagePosts(userProfile);

        // * Salvo e seto o id do perfil
        return await this.postRepository.save({
            ...dto,
            userProfileId: userProfile.id,
        });
    }

    async findAll(query: FindPostsQueryDTO) {
        const [result, total] = await Promise.all([
            this.postRepository.findManyByTitleContainsInsensitiveOptionalPaginated(
                query.title,
                paginationByQuery(query),
            ),
            this.postRepository.countByTitleContainsInsensitiveOptional(
                query.title,
            ),
        ]);

        return {
            content: result,
            meta: genMetaObject(query, total),
        };
    }

    async findOne(id: string) {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new NotFoundException("Post não encontrado.");
        }
        return post;
    }

    async update(id: string, dto: CreatePostDTO, user: AccessTokenPayload) {
        const [post, userProfile] = await Promise.all([
            this.postRepository.get(id),
            this.userProfileRepository.findByUserId(user.id),
        ]);

        this.postValidator.canManagePosts(userProfile);
        this.postValidator.isMyPost(post, userProfile);

        return await this.postRepository.save({
            ...dto,
            id: post.id,
            userProfileId: userProfile.id,
        });
    }

    async remove(id: string, user: AccessTokenPayload) {
        const [post, userProfile] = await Promise.all([
            this.postRepository.get(id),
            this.userProfileRepository.findByUserId(user.id),
        ]);

        this.postValidator.canManagePosts(userProfile);
        this.postValidator.isMyPost(post, userProfile);

        await this.postRepository.remove(id);
    }

    async findRecommended(query: PaginationQueryDTO, user: AccessTokenPayload) {
        const userProfile = await this.userProfileRepository.findByUserId(
            user.id,
            { selectModel: "withTagsAndPostTags" },
        );
        this.postValidator.canManagePosts(userProfile);

        const profileTags = userProfile.tags.map((tg) => tg.id);
        const profilePostsTags = userProfile.posts.flatMap((p) =>
            p.tags.map((tg) => tg.id),
        );
        const userTags = [...new Set([...profileTags, ...profilePostsTags])];

        const [recommendedPosts, total] = await Promise.all([
            this.postRepository.findManyByUserProfileIdNotAndTagsSomeIdInPaginatedAndOrdered(
                userProfile.id,
                userTags,
                paginationByQuery(query),
                { updatedAt: "desc" },
            ),
            this.postRepository.countByUserProfileIdNotAndTagsSomeIdIn(
                userProfile.id,
                userTags,
            ),
        ]);

        return {
            content: recommendedPosts,
            meta: genMetaObject(query, total),
        };
    }
}
