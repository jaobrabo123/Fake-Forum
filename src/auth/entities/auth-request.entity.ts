import { Request } from "express";
import { AccessTokenPayload } from "./token-payload.entity";
import { Cookies } from "./cookies.entity";

export interface AuthRequest extends Request {
    cookies: Cookies;
    user: AccessTokenPayload;
}
