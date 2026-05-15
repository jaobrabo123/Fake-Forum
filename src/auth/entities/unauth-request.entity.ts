import { Request } from "express";
import { Cookies } from "./cookies.entity";
import { AccessTokenPayload } from "./token-payload.entity";

export interface UnauthRequest extends Request {
    cookies: Partial<Cookies>;
    user?: AccessTokenPayload;
}
