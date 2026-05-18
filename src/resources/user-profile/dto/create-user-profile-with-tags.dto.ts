import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { UserTagDTO } from "./user-tag.dto";
import { CreateUserProfileDTO } from "./create-user-profile.dto";

export class CreateUserProfileWithTagsDTO extends CreateUserProfileDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserTagDTO)
    tags!: UserTagDTO[];
}
