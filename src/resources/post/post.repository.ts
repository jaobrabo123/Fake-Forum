import { Provider } from "@nestjs/common";
import { RepositoryOf, setupVSRepo } from "../../generated/vsrepo";
import { PostGetPayload } from "../../generated/prisma/models";
import { PrismaService } from "../../database/prisma.service";
import {
    userProfileRequiredWhere,
    userProfileSelectModels,
} from "../user-profile/user-profile.repository";

type Post = PostGetPayload<{ include: { tags: true } }>;

export const postRequiredWhere = {
    userProfile: userProfileRequiredWhere,
    published: true,
};

const postVSRepo = setupVSRepo<Post, "Post">()({
    tableName: "post",
    pkName: "id",
    selectModels: {
        public: {
            id: true,
            title: true,
            body: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            tags: true,
            userProfile: { select: userProfileSelectModels.public },
        },
    },
    defaultSelectModel: "public",
    requiredWhere: postRequiredWhere,
    relations: {
        tags: {
            mode: "mtm",
            pk: "name",
            restriction: "set",
        },
    },
    methods: {
        findMany: { map: true },

        findManyByTitleContainsInsensitiveOptionalPaginated: { map: true },

        countByTitleContainsInsensitiveOptional: { map: true },

        findById: { map: true, fbMode: "one" },

        existsById: { map: true },
    },
});

export type PostRepository = RepositoryOf<typeof postVSRepo>;

export const POST_REPOSITORY = Symbol("POST_REPOSITORY");

export const PostRepositoryProvider: Provider = {
    provide: POST_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return postVSRepo.build(prisma, {
            showWorking: false,
            baseMethods: {
                remove: { ignoreRequiredWhere: true },
                save: { ignoreRequiredWhere: true },
                get: { ignoreRequiredWhere: true },
            },
        });
    },
};
