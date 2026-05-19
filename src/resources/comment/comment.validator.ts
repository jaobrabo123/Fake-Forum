import { BadRequestException, Injectable } from "@nestjs/common";
import { PublicUserProfile } from "../user-profile/entities/public-user-profile.entity";
import { PublicComment } from "./entities/public-comment.entity";

@Injectable()
export class CommentValidator {
    canComment(
        userProfile: PublicUserProfile | null,
        comment?: PublicComment,
    ): asserts userProfile is PublicUserProfile {
        if (!userProfile || !userProfile.active) {
            throw new BadRequestException(
                "Você precisa ter um perfil ativo para fazer um comentário",
            );
        }
        if (comment && comment.userProfileId !== userProfile.id) {
            throw new BadRequestException(
                "Você não pode gerenciar um comentário que não é seu.",
            );
        }
    }
}
