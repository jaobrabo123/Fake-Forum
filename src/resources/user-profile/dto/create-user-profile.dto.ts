import { IsOptional } from "class-validator";
import {
    DateField,
    StringField,
    UrlField,
} from "../../../common/decorators/fields";

export class CreateUserProfileDTO {
    @StringField({ max: 150, apiProperty: true })
    name!: string;

    @StringField({ max: 3000, apiProperty: true })
    @IsOptional()
    description?: string | null;

    @DateField({ nonFuture: true, apiProperty: true, convertDate: true })
    birthDate!: Date;

    @UrlField({ apiProperty: true })
    @IsOptional()
    image?: string | null;
}
