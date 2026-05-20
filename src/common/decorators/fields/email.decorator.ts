import { applyDecorators } from "@nestjs/common";
import { IsEmail, ValidateIf } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

export function EmailField(config?: FieldConfig) {
    const decorators = [
        IsEmail({}, { message: "O email fornecido não é válido." }),
    ];

    if (config) {
        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
