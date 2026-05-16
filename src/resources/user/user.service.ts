import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { USER_REPOSITORY, type UserRepository } from "./user.repository";
import { PublicUser } from "./entities/public-user.entity";
import { Argon2Service } from "../../auth/argon2.service";

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        private readonly argon2Service: Argon2Service,
    ) {}

    async create(user: CreateUserDTO): Promise<PublicUser> {
        const emailInUse = await this.userRepository.existsByEmail(user.email);
        if (emailInUse)
            throw new ConflictException("Já existe um usuário com esse email.");

        user.password = await this.argon2Service.hash(user.password);
        return await this.userRepository.save(user, {
            selectModel: "withProfile",
        });
    }
}
