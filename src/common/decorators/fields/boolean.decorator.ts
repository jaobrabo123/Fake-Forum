import { applyDecorators } from "@nestjs/common";
import { IsBoolean } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

export function BooleanField(config?: FieldConfig) {
    const decorators = [
        IsBoolean({ message: "Campo deve ser um boolean válido." }),
    ];

    if (config) {
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
