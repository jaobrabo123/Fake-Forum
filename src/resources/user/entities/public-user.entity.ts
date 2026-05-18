import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";

export class PublicUser {
    id!: string;
    email!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export class PublicUserResponse extends SuccessResponseBody<PublicUser> {
    declare content: PublicUser;
}
