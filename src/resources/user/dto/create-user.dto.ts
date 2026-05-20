import { ApiProperty } from "@nestjs/swagger";
import { CreateUserProfileDTO } from "../../user-profile/dto/create-user-profile.dto";
import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EmailField, PasswordField } from "../../../common/decorators/fields";
import { ToLowerCase } from "../../../common/decorators/transformers/lower-case.transform";

export class CreateUserDTO {
    @EmailField({ apiProperty: true })
    @ToLowerCase()
    email!: string;

    @PasswordField({ apiProperty: true })
    password!: string;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateUserProfileDTO)
    profile?: CreateUserProfileDTO;
}
