import { SuccessResponseBody } from "../../common/interceptors/entities/success-response-body.entity";

export class Session {
    id!: string;
    userId!: string;
    userAgent!: string;
    ip!: string;
    createdAt!: Date;
}

export class SessionsResponse extends SuccessResponseBody<Session[]> {
    declare content: Session[];
}

export class SessionResponse extends SuccessResponseBody<Session> {
    declare content: Session;
}
