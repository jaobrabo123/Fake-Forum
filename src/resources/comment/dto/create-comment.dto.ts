import { StringField, UUIDField } from "../../../common/decorators/fields";

export class CreateCommentDTO {
    @StringField({ apiProperty: true, max: 3000 })
    body!: string;

    @UUIDField({ apiProperty: true })
    postId!: string;

    @UUIDField({ apiProperty: true, nullAble: true })
    replyToId!: string | null;
}
