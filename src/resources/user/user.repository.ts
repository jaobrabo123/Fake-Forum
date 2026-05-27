import { Provider } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { /*RepositoryOf,*/ setupVSRepo } from "../../../generated/vsrepo";
import { Prisma } from "../../../generated/prisma/client";

const userVSRepo = setupVSRepo<
    Prisma.UserGetPayload<{ include: { profile: true } }>,
    "User"
>()({
    tableName: "user",
    pkName: "id",
    selectModels: {
        public: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
        auth: {
            id: true,
            email: true,
            password: true,
            tokenVersion: true,
        },
        withProfile: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            profile: {
                select: {
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
        },
        tokenVersion: {
            id: true,
            tokenVersion: true,
        },
    },
    defaultSelectModel: "public",
    requiredWhere: {
        deletedAt: null,
    },
    relations: {
        profile: {
            mode: "oto",
            pk: "id",
            restriction: "add",
        },
    },
    methods: {
        findAuthByEmail: {
            map: true,
            proxyTo: "findUniqueByEmail",
            selectModel: "auth",
        },

        existsByEmail: { map: true },

        findByEmail: { map: true, fbMode: "one" },

        updateById: { map: true },
    },
});

// type BaseUserRepository = RepositoryOf<typeof userVSRepo>;

// const extensionFunc = (repo: BaseUserRepository) => ({
//     updateTokenVersion: async (userId: string) => {
//         return repo.updateById(
//             userId,
//             { tokenVersion: { increment: 1 } },
//             { selectModel: "tokenVersion" },
//         );
//     },
// });

// export type UserRepository = RepositoryOf<
//     typeof userVSRepo,
//     undefined,
//     ReturnType<typeof extensionFunc>
// >;

const setupUserRepository = (prisma: PrismaService) => {
    return userVSRepo.build(prisma).extend((repo) => ({
        updateTokenVersion: async (userId: string) => {
            return repo.updateById(
                userId,
                { tokenVersion: { increment: 1 } },
                { selectModel: "tokenVersion" },
            );
        },
    }));
};

export type UserRepository = ReturnType<typeof setupUserRepository>;

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export const UserRepositoryProvider: Provider = {
    provide: USER_REPOSITORY,
    inject: [PrismaService],
    // useFactory: (prisma: PrismaService) => {
    //     return userVSRepo.build(prisma).extend(extensionFunc);
    // },
    useFactory: setupUserRepository,
};
