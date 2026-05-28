import { StringField } from "../../../common/decorators/fields";
import { ToUpperCase } from "../../../common/decorators/transformers/upper-case.transformer";

export class UserTagDTO {
    @StringField({ apiProperty: true })
    @ToUpperCase()
    name!: string;
}
