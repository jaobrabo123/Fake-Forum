import { Provider } from "@nestjs/common";
import {
    VSRepositoryOf,
    setupVSRepo,
} from "../../../VSRepository/VSRepository";
import { PrismaService } from "../../database/prisma.service";
import { UserGetPayload } from "../../generated/prisma/models";

const userVSRepo = setupVSRepo<
    UserGetPayload<{ include: { profile: true } }>,
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
    },
});

export type UserRepository = VSRepositoryOf<typeof userVSRepo>;

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export const UserRepositoryProvider: Provider = {
    provide: USER_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return userVSRepo.build(prisma);
    },
};
