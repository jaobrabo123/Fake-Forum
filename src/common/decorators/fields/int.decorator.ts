import { applyDecorators } from "@nestjs/common";
import { IsInt, Max, Min, ValidateIf } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

interface IntFieldConfig extends FieldConfig {
    max?: number;
    min?: number;
}

export function IntField(config?: IntFieldConfig) {
    const decorators = [
        IsInt({ message: "Campo deve ser um número inteiro." }),
    ];

    if (config) {
        if (config.max) decorators.push(Max(config.max));
        if (config.min) decorators.push(Min(config.min));
        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
