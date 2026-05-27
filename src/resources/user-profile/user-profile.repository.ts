import { Provider } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UserProfileGetPayload } from "../../../generated/prisma/models";
import {
    RepositoryOf,
    SelectModels,
    setupVSRepo,
    WhereModel,
} from "../../../generated/vsrepo";

export const userProfileSelectModels = {
    public: {
        id: true,
        name: true,
        birthDate: true,
        description: true,
        active: true,
        image: true,
        createdAt: true,
        updatedAt: true,
    },
    withTags: {
        id: true,
        name: true,
        birthDate: true,
        description: true,
        active: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
    },
    withTagsAndPostTags: {
        id: true,
        name: true,
        birthDate: true,
        description: true,
        active: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        posts: {
            select: { tags: true },
        },
    },
} satisfies SelectModels<"UserProfile">;

export const userProfileRequiredWhere = {
    active: true,
} satisfies WhereModel<"UserProfile">;

type UserProfile = UserProfileGetPayload<{
    include: { tags: true; user: true };
}>;

const userProfileVSRepo = setupVSRepo<UserProfile, "UserProfile">()({
    tableName: "userProfile",
    pkName: "id",
    selectModels: userProfileSelectModels,
    requiredWhere: userProfileRequiredWhere,
    defaultSelectModel: "public",
    relations: {
        tags: {
            mode: "mtm",
            pk: "name",
            restriction: "set",
        },
    },
    methods: {
        existsByUserId: { map: true, whereType: "overwrite" },

        findMany: { map: true },

        findByUserId: { map: true, fbMode: "one", whereType: "overwrite" },

        deleteByUserId: { map: true },
    },
});

export type UserProfileRepository = RepositoryOf<typeof userProfileVSRepo>;

export const USER_PROFILE_REPOSITORY = Symbol("USER_PROFILE_REPOSITORY");

export const UserProfileRepositoryProvider: Provider = {
    provide: USER_PROFILE_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return userProfileVSRepo.build(prisma, {
            baseMethods: { save: { ignoreRequiredWhere: true } },
        });
    },
};
