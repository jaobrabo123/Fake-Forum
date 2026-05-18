import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { IntField } from "../decorators/fields";

export class PaginationQueryDTO {
    @IsOptional()
    @Type(() => Number)
    @IntField({ min: 1, apiProperty: true })
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IntField({ min: 1, max: 50, apiProperty: true })
    perPage: number = 9;
}
