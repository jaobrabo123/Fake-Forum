import { IsOptional } from "class-validator";
import { StringField, UUIDField } from "../../../common/decorators/fields";

export class CreateCommentDto {
    @StringField({ apiProperty: true, max: 3000 })
    body!: string;

    @UUIDField({ apiProperty: true })
    postId!: string;

    @IsOptional()
    @UUIDField({ apiProperty: true })
    replyToId?: string;
}
