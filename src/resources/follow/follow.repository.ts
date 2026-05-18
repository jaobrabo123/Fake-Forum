import { Provider } from "@nestjs/common";
import { setupVSRepo, RepositoryOf } from "../../generated/vsrepo";
import { Follow } from "../../generated/prisma/client";
import { PrismaService } from "../../database/prisma.service";
import {
    userProfileRequiredWhere,
    userProfileSelectModels,
} from "../user-profile/user-profile.repository";

const followVSRepo = setupVSRepo<Follow, "Follow">()({
    tableName: "follow",
    pkName: "id",
    selectModels: {
        withFollower: {
            id: true,
            createdAt: true,
            followerId: true,
            followingId: true,
            follower: {
                select: userProfileSelectModels.public,
            },
        },
        withFollowing: {
            id: true,
            createdAt: true,
            followerId: true,
            followingId: true,
            following: {
                select: userProfileSelectModels.public,
            },
        },
    },
    requiredWhere: {
        follower: userProfileRequiredWhere,
        following: userProfileRequiredWhere,
    },
    methods: {
        findByFollowingId: { map: true },

        findByFollowerId: { map: true },

        existsByFollowingIdAndFollowerId: { map: true },

        findUniqueByFollowingIdAndFollowerId: { map: true },
    },
});

export type FollowRepository = RepositoryOf<typeof followVSRepo>;

export const FOLLOW_REPOSITORY = Symbol("FOLLOW_REPOSITORY");

export const FollowRepositoryProvider: Provider = {
    inject: [PrismaService],
    provide: FOLLOW_REPOSITORY,
    useFactory: (prisma: PrismaService) => {
        return followVSRepo.build(prisma, { showWorking: false });
    },
};
