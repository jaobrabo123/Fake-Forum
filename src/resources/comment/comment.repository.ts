import { Provider } from "@nestjs/common";
import { Comment } from "../../generated/prisma/client";
import { RepositoryOf, setupVSRepo } from "../../generated/vsrepo";
import { PrismaService } from "../../database/prisma.service";
import { postRequiredWhere } from "../post/post.repository";

const commentVSRepo = setupVSRepo<Comment, "Comment">()({
    tableName: "comment",
    pkName: "id",
    requiredWhere: { post: postRequiredWhere },
    methods: {
        findByPostIdAndReplyToIdIsNullPaginated: { map: true },

        countByPostIdAndReplyToIdIsNull: { map: true },

        findByReplyToIdPaginated: { map: true },

        countByReplyToId: { map: true },
    },
});

export type CommentRepository = RepositoryOf<typeof commentVSRepo>;

export const COMMENT_REPOSITORY = Symbol("COMMENT_REPOSITORY");

export const CommentRepositoryProvider: Provider = {
    provide: COMMENT_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return commentVSRepo.build(prisma);
    },
};
