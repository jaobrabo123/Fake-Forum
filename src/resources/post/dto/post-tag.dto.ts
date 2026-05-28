import { StringField } from "../../../common/decorators/fields";
import { ToUpperCase } from "../../../common/decorators/transformers/upper-case.transformer";

export class PostTagDTO {
    @StringField({ apiProperty: true })
    @ToUpperCase()
    name!: string;
}
