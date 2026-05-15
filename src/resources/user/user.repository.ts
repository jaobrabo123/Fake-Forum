import { Provider } from "@nestjs/common";
import {
    VSRepositoryOf,
    setupVSRepo,
} from "../../../VSRepository/VSRepository";
import { User } from "../../generated/prisma/client";
import { PrismaService } from "../../database/prisma.service";

const userVSRepo = setupVSRepo<User, "User">()({
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
    requiredWhere: {
        deletedAt: null,
    },
    defaultSelectModel: "public",
    methods: {
        findAuthByEmail: {
            map: true,
            proxyTo: "findUniqueByEmail",
            selectModel: "auth",
        },
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
