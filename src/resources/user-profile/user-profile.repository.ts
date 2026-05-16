import { Provider } from "@nestjs/common";
import {
    RepositoryOf,
    SelectModels,
    setupVSRepo,
    WhereModel,
} from "../../../VSRepository/VSRepository";
import { UserProfile } from "../../generated/prisma/client";
import { PrismaService } from "../../database/prisma.service";

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
} satisfies SelectModels<"UserProfile">;

export const userProfileRequiredWhere = {
    active: true,
} satisfies WhereModel<"UserProfile">;

const userProfileVSRepo = setupVSRepo<UserProfile, "UserProfile">()({
    tableName: "userProfile",
    pkName: "id",
    selectModels: userProfileSelectModels,
    requiredWhere: userProfileRequiredWhere,
    defaultSelectModel: "public",
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
