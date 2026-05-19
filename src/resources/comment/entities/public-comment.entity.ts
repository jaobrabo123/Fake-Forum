import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "../../../common/interceptors/entities/meta.entity";
import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";

export class PublicComment {
    userProfileId!: string;
    body!: string;
    postId!: string;
    replyToId!: string | null;
    createdAt!: Date;
    updatedAt!: Date;
}

export class PublicCommentResponse extends SuccessResponseBody<PublicComment> {
    declare content: PublicComment;
}

export class PublicCommentResponseWithMeta extends SuccessResponseBody<
    PublicComment[]
> {
    @ApiProperty()
    declare meta: Meta;

    declare content: PublicComment[];
}
