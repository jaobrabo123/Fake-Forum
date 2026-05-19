import { StringField } from "../../../common/decorators/fields";

export class UpdateCommentDto {
    @StringField({ apiProperty: true, max: 3000 })
    body!: string;
}
