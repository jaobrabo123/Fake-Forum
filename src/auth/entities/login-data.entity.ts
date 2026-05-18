import { SuccessResponseBody } from "../../common/interceptors/entities/success-response-body.entity";

export class LoginData {
    accessToken!: string;
}

export class LoginDataResponse extends SuccessResponseBody<LoginData> {
    declare content: LoginData;
}
