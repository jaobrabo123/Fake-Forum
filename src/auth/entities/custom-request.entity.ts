import { Request } from "express";
import { AccessTokenPayload } from "./token-payload.entity";
import { Cookies } from "./cookies.entity";

export interface CustomAuthRequest extends Request {
    cookies: Cookies;
    user: AccessTokenPayload;
}

export interface CustomUnauthRequest extends Request {
    cookies: Partial<Cookies>;
    user?: AccessTokenPayload;
}
