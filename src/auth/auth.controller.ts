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
import { AuthGuard } from "./auth.guard";
import { Cookies } from "../common/decorators/request/cookies.decorator";
import { CurrentUser } from "../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "./entities/token-payload.entity";
import { Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ general: { limit: 10, ttl: 5 * 60 * 1000 } })
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
        const { cookies } = await this.authService.refresh(
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
        @Cookies("refreshToken") refreshToken: string | undefined,
        @Res({ passthrough: true }) res: Response,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        await this.authService.logout(user.sub, refreshToken);

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
