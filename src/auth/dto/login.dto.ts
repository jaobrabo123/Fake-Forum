import { EmailField } from "../../common/decorators/fields/email.decorator";
import { StringField } from "../../common/decorators/fields/string.decorator";
import { ToLowerCase } from "../../common/decorators/transformers/lower-case.transform";

export class LoginDTO {
    @EmailField({ apiProperty: true })
    @ToLowerCase()
    email!: string;

    @StringField({ apiProperty: true })
    password!: string;
}
