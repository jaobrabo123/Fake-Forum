import { applyDecorators } from "@nestjs/common";
import { IsDate, MaxDate, MinDate, ValidateIf } from "class-validator";
import { FieldConfig } from "./entities/field-config.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

interface DateFieldConfig extends FieldConfig {
    max?: Date;
    min?: Date;
    nonFuture?: boolean;
    nonPast?: boolean;
    convertDate?: boolean;
}

export function DateField(config?: DateFieldConfig) {
    const decorators = [IsDate({ message: "Campo deve ser uma data válida." })];

    if (config) {
        if (config.nonFuture)
            decorators.push(
                MaxDate(new Date(), {
                    message: "Não pode ser uma data no futuro.",
                }),
            );
        else if (config.max)
            decorators.push(
                MaxDate(config.max, {
                    message: `A data máxima é ${config.max.toString()}`,
                }),
            );

        if (config.nonPast)
            decorators.push(
                MinDate(new Date(), {
                    message: "Não pode ser uma data no passado.",
                }),
            );
        else if (config.min)
            decorators.push(
                MinDate(config.min, {
                    message: `A data mínima é ${config.min.toString()}`,
                }),
            );

        if (config.convertDate) decorators.push(Type(() => Date));

        if (config.nullAble)
            decorators.push(ValidateIf((_, value) => value !== null));
        if (config.apiProperty)
            decorators.push(ApiProperty(config.apiPropertyOptions));
    }

    return applyDecorators(...decorators);
}
