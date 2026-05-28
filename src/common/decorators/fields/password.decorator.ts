import { applyDecorators } from "@nestjs/common";
import { IsStrongPassword, ValidateIf } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "../transformers/trim.transformer";

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
                message:
                    "Senha fraca, deve conter pelo menos 8 caracteres, 1 letra maiúscula, 1 minúscula e 1 número.",
            },
        ),
        Trim(),
    ];

    if (config) {
        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
