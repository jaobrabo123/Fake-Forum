import { BadRequestException, Injectable } from "@nestjs/common";
import { PublicUserProfile } from "../user-profile/entities/public-user-profile.entity";

@Injectable()
export class FollowValidator {
    canManageFollows(
        userProfile: PublicUserProfile | null,
    ): asserts userProfile is PublicUserProfile {
        if (!userProfile)
            throw new BadRequestException(
                "Você precisa ter um perfil para gerenciar seus folows",
            );
        if (!userProfile.active)
            throw new BadRequestException(
                "Ative seu perfil para gerenciar seus folows.",
            );
    }
}
