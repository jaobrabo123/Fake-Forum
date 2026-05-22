import { StringField } from "../../../common/decorators/fields";

export class UpdateCommentDTO {
    @StringField({ apiProperty: true, max: 3000 })
    body!: string;
}
