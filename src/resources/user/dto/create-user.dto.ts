import { EmailField } from "../../../common/decorators/fields/email.decorator";
import { PasswordField } from "../../../common/decorators/fields/password.decorator";

export class CreateUserDTO {
    @EmailField({ apiProperty: true })
    email!: string;

    @PasswordField({ apiProperty: true })
    password!: string;
}
