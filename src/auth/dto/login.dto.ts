import { EmailField } from "../../common/decorators/fields/email.decorator";
import { StringField } from "../../common/decorators/fields/string.decorator";

export class LoginDTO {
    @EmailField({ apiProperty: true })
    email!: string;

    @StringField({ apiProperty: true })
    password!: string;
}
