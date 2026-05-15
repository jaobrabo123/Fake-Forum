import { IsOptional } from "class-validator";
import { DateField } from "../../../common/decorators/fields/date.decorator";
import { StringField } from "../../../common/decorators/fields/string.decorator";
import { UrlField } from "../../../common/decorators/fields/url.decorator";
import { BooleanField } from "../../../common/decorators/fields/boolean.decorator";

export class CreateUserProfileDto {
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

    @BooleanField({ apiProperty: true })
    @IsOptional()
    active?: boolean;
}
