import { applyDecorators } from "@nestjs/common";
import { IsDate, MaxDate, MinDate } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";

interface DateFieldConfig extends FieldConfig {
    max?: Date;
    min?: Date;
    nonFuture?: boolean;
    nonPast?: boolean;
}

export function DateField(config?: DateFieldConfig) {
    const decorators = [IsDate({ message: "Campo deve ser uma data válida." })];

    if (config) {
        if (config.nonFuture) decorators.push(MaxDate(new Date()));
        else if (config.max) decorators.push(MaxDate(config.max));

        if (config.nonPast) decorators.push(MinDate(new Date()));
        else if (config.min) decorators.push(MinDate(config.min));

        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
