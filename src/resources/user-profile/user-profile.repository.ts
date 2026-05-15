import { Provider } from "@nestjs/common";
import {
    VSRepositoryOf,
    setupVSRepo,
} from "../../../VSRepository/VSRepository";
import { UserProfile } from "../../generated/prisma/client";
import { PrismaService } from "../../database/prisma.service";

const userProfileVSRepo = setupVSRepo<UserProfile, "UserProfile">()({
    tableName: "userProfile",
    pkName: "id",
    selectModels: {
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
    },
    requiredWhere: {
        active: true,
    },
    defaultSelectModel: "public",
    methods: {},
});

export type UserProfileRepository = VSRepositoryOf<typeof userProfileVSRepo>;

export const USER_PROFILE_REPOSITORY = Symbol("USER_PROFILE_REPOSITORY");

export const UserProfileRepositoryProvider: Provider = {
    provide: USER_PROFILE_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return userProfileVSRepo.build(prisma);
    },
};
