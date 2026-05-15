import { applyDecorators } from "@nestjs/common";
import { IsUUID } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

export function UUIDField(config?: FieldConfig) {
    const decorators = [
        IsUUID(4, { message: "Campo deve ser um UUID válido." }),
    ];

    if (config) {
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
