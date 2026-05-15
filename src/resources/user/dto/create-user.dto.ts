import { ApiProperty } from "@nestjs/swagger";
import { EmailField } from "../../../common/decorators/fields/email.decorator";
import { PasswordField } from "../../../common/decorators/fields/password.decorator";
import { CreateUserProfileDto } from "../../user-profile/dto/create-user-profile.dto";
import { IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDTO {
    @EmailField({ apiProperty: true })
    email!: string;

    @PasswordField({ apiProperty: true })
    password!: string;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateUserProfileDto)
    profile?: CreateUserProfileDto;
}
