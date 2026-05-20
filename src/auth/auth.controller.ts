import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import type { Response } from "express";
import { ApiOkResponse } from "@nestjs/swagger";
import { LoginData, LoginDataResponse } from "./entities/login-data.entity";
import {
    clearAccessTokenCookie,
    clearGoogleStateCookie,
    clearRefreshTokenCookie,
    setAccessTokenCookie,
    setGoogleStateCookie,
    setRefreshTokenCookie,
} from "../common/utils/cookie.util";
import type { UnauthRequest } from "./entities/unauth-request.entity";
import type { AuthRequest } from "./entities/auth-request.entity";
import { AuthGuard } from "./auth.guard";
import { Cookies } from "../common/decorators/request/cookies.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginDataResponse })
    async login(
        @Body() loginDTO: LoginDTO,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginData> {
        const { cookies } = await this.authService.login(loginDTO);

        setAccessTokenCookie(cookies.accessToken, res);
        setRefreshTokenCookie(cookies.refreshToken, res);

        return { accessToken: cookies.accessToken };
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginDataResponse })
    async refresh(
        @Req() req: UnauthRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginData> {
        const { cookies } = await this.authService.refreshTokens(
            req.cookies.refreshToken,
        );

        setAccessTokenCookie(cookies.accessToken, res);
        setRefreshTokenCookie(cookies.refreshToken, res);

        return { accessToken: cookies.accessToken };
    }

    @UseGuards(AuthGuard)
    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(
        @Req() req: AuthRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        const sessionId = req.user.sessionId;

        await this.authService.logout(sessionId);

        clearAccessTokenCookie(res);
        clearRefreshTokenCookie(res);
    }

    @Get("google")
    google(@Res() res: Response) {
        const { googleState, redirectUrl } = this.authService.google();

        setGoogleStateCookie(googleState, res);

        return res.redirect(redirectUrl);
    }

    @Get("google/callback")
    async googleLogin(
        @Res({ passthrough: true }) res: Response,
        @Query("code") code: string,
        @Query("state") state: string,
        @Cookies("googleState") googleStateCookie: string | undefined,
    ) {
        const { cookies } = await this.authService.googleLogin(
            code,
            state,
            googleStateCookie,
        );

        clearGoogleStateCookie(res);
        setAccessTokenCookie(cookies.accessToken, res);
        setRefreshTokenCookie(cookies.refreshToken, res);

        return { accessToken: cookies.accessToken };
    }
}
