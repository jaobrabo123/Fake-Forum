import { IsArray, ValidateNested } from "class-validator";
import { BooleanField, StringField } from "../../../common/decorators/fields";
import { PostTagDTO } from "./post-tag.dto";
import { Type } from "class-transformer";

export class CreatePostDTO {
    @StringField({ max: 200, apiProperty: true })
    title!: string;

    @StringField({ max: 10000, apiProperty: true })
    body!: string;

    @BooleanField({ apiProperty: true })
    published!: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PostTagDTO)
    tags!: PostTagDTO[];
}
