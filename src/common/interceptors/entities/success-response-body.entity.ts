import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "./meta.entity";

export class SuccessResponseBody<T> {
    @ApiProperty({ example: true })
    success!: boolean;

    @ApiProperty({ example: 200 })
    statusCode!: number;

    timestamp!: Date;

    @ApiProperty({ example: "Sucesso" })
    message?: string;

    content?: T;

    meta?: Meta;
}
