import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserProfileDTO } from "./dto/create-user-profile.dto";
import { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import {
    USER_PROFILE_REPOSITORY,
    type UserProfileRepository,
} from "./user-profile.repository";

@Injectable()
export class UserProfileService {
    constructor(
        @Inject(USER_PROFILE_REPOSITORY)
        private readonly userProfileRepository: UserProfileRepository,
    ) {}

    async create(userProfile: CreateUserProfileDTO, user: AccessTokenPayload) {
        const hasProfile = await this.userProfileRepository.existsByUserId(
            user.id,
        );
        if (hasProfile)
            throw new BadRequestException("Você já possui um perfil");

        return await this.userProfileRepository.save(
            {
                ...userProfile,
                userId: user.id,
            },
            { selectModel: "withTags" },
        );
    }

    async findAll() {
        return await this.userProfileRepository.findMany();
    }

    async findMe(user: AccessTokenPayload) {
        const profile = await this.userProfileRepository.findByUserId(user.id, {
            selectModel: "withTags",
        });
        if (!profile) throw new NotFoundException("Perfil não encontrado.");
        return profile;
    }

    async findOne(id: string) {
        const profile = await this.userProfileRepository.get(id, {
            selectModel: "withTags",
        });
        if (!profile) throw new NotFoundException("Perfil não encontrado.");
        return profile;
    }

    async update(dto: CreateUserProfileDTO, user: AccessTokenPayload) {
        const profile = await this.userProfileRepository.findByUserId(user.id);
        if (!profile) throw new NotFoundException("Perfil não encontrado");
        return await this.userProfileRepository.save(
            {
                ...dto,
                id: profile.id,
                userId: user.id,
            },
            { selectModel: "withTags" },
        );
    }

    async remove(user: AccessTokenPayload) {
        const profile = await this.userProfileRepository.findByUserId(user.id);
        if (!profile) throw new NotFoundException("Perfil não encontrado");
        await this.userProfileRepository.deleteByUserId(user.id);
    }
}
