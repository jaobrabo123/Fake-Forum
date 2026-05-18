import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";

export class PublicFollow {
    id!: string;
    createdAt!: Date;
    followerId!: string;
    followingId!: string;
}

export class PublicFollowResponse extends SuccessResponseBody<PublicFollow> {
    declare content: PublicFollow;
}
