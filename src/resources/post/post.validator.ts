import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PublicUserProfile } from "../user-profile/entities/public-user-profile.entity";
import { PublicPost } from "./entities/public-post.entity";

@Injectable()
export class PostValidator {
    /**
     * Valida se o perfil do usuário existe e está ativo, se não lança erro.
     * @param userProfile Perfil do usuário
     * @throws BadRequestException
     */
    canManagePosts(
        userProfile: PublicUserProfile | null,
    ): asserts userProfile is PublicUserProfile {
        if (!userProfile) {
            throw new BadRequestException(
                "Você precisa ter um perfil para gerenciar seus posts.",
            );
        }

        if (!userProfile.active) {
            throw new BadRequestException(
                "Ative seu perfil para gerenciar seus posts.",
            );
        }
    }

    isMyPost(
        post: PublicPost | null,
        userProfile: PublicUserProfile,
    ): asserts post is PublicPost {
        if (!post) {
            throw new NotFoundException("Post não encontrado.");
        }

        if (post.userProfile.id !== userProfile.id) {
            throw new BadRequestException(
                "Você não pode gerenciar o post de outra pessoa.",
            );
        }
    }
}
