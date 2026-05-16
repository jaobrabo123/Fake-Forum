import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateFollowDTO } from "./dto/create-follow.dto";
import { AccessTokenPayload } from "../../auth/entities/token-payload.entity";
import { FOLLOW_REPOSITORY, type FollowRepository } from "./follow.repository";
import {
    USER_PROFILE_REPOSITORY,
    type UserProfileRepository,
} from "../user-profile/user-profile.repository";
import { FollowValidator } from "./follow.validator";

@Injectable()
export class FollowService {
    constructor(
        @Inject(FOLLOW_REPOSITORY)
        private readonly followRepository: FollowRepository,
        @Inject(USER_PROFILE_REPOSITORY)
        private readonly userProfileRepository: UserProfileRepository,
        private readonly followValidator: FollowValidator,
    ) {}

    async create(dto: CreateFollowDTO, user: AccessTokenPayload) {
        const [following, follower] = await Promise.all([
            this.userProfileRepository.get(dto.followingId),
            this.userProfileRepository.findByUserId(user.id),
        ]);

        this.followValidator.canManageFollows(follower);

        if (!following) throw new NotFoundException("Perfil não encontrado.");
        if (follower.id === following.id)
            throw new BadRequestException("Você não pode seguir a si mesmo.");

        if (
            await this.followRepository.existsByFollowingIdAndFollowerId(
                following.id,
                follower.id,
            )
        )
            throw new BadRequestException("Você já segue esse perfil.");

        return await this.followRepository.save({
            followingId: following.id,
            followerId: follower.id,
        });
    }

    async findFollowing(user: AccessTokenPayload) {
        const follower = await this.userProfileRepository.findByUserId(user.id);

        this.followValidator.canManageFollows(follower);

        return await this.followRepository.findByFollowerId(follower.id, {
            selectModel: "withFollowing",
        });
    }

    async findFollowers(user: AccessTokenPayload) {
        const following = await this.userProfileRepository.findByUserId(
            user.id,
        );

        this.followValidator.canManageFollows(following);

        return await this.followRepository.findByFollowingId(user.id, {
            selectModel: "withFollower",
        });
    }

    async deleteFollowing(followingId: string, user: AccessTokenPayload) {
        const follower = await this.userProfileRepository.findByUserId(user.id);

        this.followValidator.canManageFollows(follower);

        const follow =
            await this.followRepository.findUniqueByFollowingIdAndFollowerId(
                followingId,
                follower.id,
            );

        if (!follow) {
            throw new NotFoundException("Você não está seguindo esse usuário.");
        }

        await this.followRepository.remove(follow.id);
    }
}
