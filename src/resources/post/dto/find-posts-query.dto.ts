import { IsOptional } from "class-validator";
import { PaginationQueryDTO } from "../../../common/dto/pagination-query.dto";
import { StringField } from "../../../common/decorators/fields";

export class FindPostsQueryDTO extends PaginationQueryDTO {
    @IsOptional()
    @StringField({ apiProperty: true })
    title?: string;
}
