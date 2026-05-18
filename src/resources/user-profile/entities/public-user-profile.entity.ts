import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";

export class PublicUserProfile {
    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    name!: string;
    description!: string | null;
    birthDate!: Date;
    active!: boolean;
    image!: string | null;
}

export class PublicUserProfileResponse extends SuccessResponseBody<PublicUserProfile> {
    declare content: PublicUserProfile;
}
