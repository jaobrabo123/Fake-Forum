import { PartialType } from "@nestjs/swagger";
import { CreateUserProfileDTO } from "./create-user-profile.dto";

export class UpdateUserProfileDTO extends PartialType(CreateUserProfileDTO) {}
