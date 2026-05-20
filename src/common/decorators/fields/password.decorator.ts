import { applyDecorators } from "@nestjs/common";
import { IsStrongPassword, ValidateIf } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

export function PasswordField(config?: FieldConfig) {
    const decorators = [
        IsStrongPassword(
            {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
            },
            {
                message: "Senha fraca.",
            },
        ),
    ];

    if (config) {
        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
