import { StringField } from "../../../common/decorators/fields";
import { ToUpperCase } from "../../../common/decorators/transformers/upper-case.transform";

export class PostTagDTO {
    @StringField({ apiProperty: true })
    @ToUpperCase()
    name!: string;
}
