import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDTO: LoginDTO,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { content, cookies } = await this.authService.login(loginDTO);
        response.cookie("accessToken", cookies.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return content;
    }
}
