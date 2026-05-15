import { applyDecorators } from "@nestjs/common";
import { IsDate } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

export function UrlField(config?: FieldConfig) {
    const decorators = [IsDate({ message: "Campo deve ser uma data válida." })];

    if (config) {
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
