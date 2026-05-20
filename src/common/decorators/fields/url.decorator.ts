import { applyDecorators } from "@nestjs/common";
import { IsUrl, ValidateIf } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

export function UrlField(config?: FieldConfig) {
    const decorators = [
        IsUrl({}, { message: "Campo deve ser uma URL válida." }),
    ];

    if (config) {
        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
