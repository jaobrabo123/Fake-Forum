import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    ValidateIf,
} from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { Trim } from "../transformers/trim.transformer";

interface StringFieldConfig extends FieldConfig {
    max?: number;
    min?: number;
    nonTrim?: boolean;
}

export function StringField(config?: StringFieldConfig) {
    const decorators = [
        IsString({ message: "Campo deve ser uma string." }),
        IsNotEmpty({ message: "Campo deve ser fornecido." }),
    ];

    if (config) {
        if (config.max)
            decorators.push(
                MaxLength(config.max, {
                    message: `Campo deve ter no máximo ${config.max} caracteres.`,
                }),
            );
        if (config.min)
            decorators.push(
                MinLength(config.min, {
                    message: `Campo deve ter no mínimo ${config.min} caracteres.`,
                }),
            );
        if (!config.nonTrim) decorators.push(Trim());
        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
