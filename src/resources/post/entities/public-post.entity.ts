import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "../../../common/interceptors/entities/meta.entity";
import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";
import { PublicUserProfile } from "../../user-profile/entities/public-user-profile.entity";

export class PublicPost {
    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    tags!: {
        id: string;
        createdAt: Date;
        name: string;
    }[];
    title!: string;
    body!: string;
    published!: boolean;
    userProfile!: PublicUserProfile;
}

export class PublicPostResponse extends SuccessResponseBody<PublicPost> {
    declare content: PublicPost;
}

export class PublicPostResponseWithMeta extends PublicPostResponse {
    @ApiProperty()
    declare meta: Meta;
}
