import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Ip,
    Param,
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
import type { CustomUnauthRequest } from "./entities/custom-request.entity";
import { AuthGuard } from "./auth.guard";
import { Cookies } from "../common/decorators/request/cookies.decorator";
import { CurrentUser } from "../common/decorators/request/current-user.decorator";
import type { AccessTokenPayload } from "./entities/token-payload.entity";
import { Throttle } from "@nestjs/throttler";
import { ApiRequireAuth } from "../common/decorators/request/api-require-auth.decorator";
import { SessionResponse, SessionsResponse } from "./entities/session.entity";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Throttle({ general: { limit: 10, ttl: 5 * 60 * 1000 } })
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginDataResponse })
    async login(
        @Body() loginDTO: LoginDTO,
        @Req() req: CustomUnauthRequest,
        @Res({ passthrough: true }) res: Response,
        @Ip() ip: string,
    ): Promise<LoginData> {
        const { cookies } = await this.authService.login(
            loginDTO,
            req.headers["user-agent"],
            ip,
        );

        setAccessTokenCookie(cookies.accessToken, res);
        setRefreshTokenCookie(cookies.refreshToken, res);

        return { accessToken: cookies.accessToken };
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginDataResponse })
    async refresh(
        @Req() req: CustomUnauthRequest,
        @Res({ passthrough: true }) res: Response,
        @Ip() ip: string,
    ): Promise<LoginData> {
        const { cookies } = await this.authService.refresh(
            req.cookies.refreshToken,
            req.headers["user-agent"],
            ip,
        );

        setAccessTokenCookie(cookies.accessToken, res);
        setRefreshTokenCookie(cookies.refreshToken, res);

        return { accessToken: cookies.accessToken };
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(
        @Cookies("refreshToken") refreshToken: string | undefined,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(refreshToken);

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
        @Req() req: CustomUnauthRequest,
        @Res({ passthrough: true }) res: Response,
        @Query("code") code: string,
        @Query("state") state: string,
        @Ip() ip: string,
    ) {
        const { cookies } = await this.authService.googleLogin(
            code,
            state,
            req.cookies.googleState,
            req.headers["user-agent"],
            ip,
        );

        clearGoogleStateCookie(res);
        setAccessTokenCookie(cookies.accessToken, res);
        setRefreshTokenCookie(cookies.refreshToken, res);

        return { accessToken: cookies.accessToken };
    }

    @Get("sessions")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: SessionsResponse })
    findSessions(@CurrentUser() user: AccessTokenPayload) {
        return this.authService.findSessions(user);
    }

    @Delete("sessions")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async globalLogout(
        @Res({ passthrough: true }) res: Response,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        await this.authService.globalLogout(user);

        clearAccessTokenCookie(res);
        clearRefreshTokenCookie(res);
    }

    @Get("sessions/:sessionId")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @ApiOkResponse({ type: SessionResponse })
    findSessionsBySessionId(
        @Param("sessionId") sessionId: string,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        return this.authService.findSessionsBySessionId(sessionId, user);
    }

    @Delete("sessions/:sessionId")
    @UseGuards(AuthGuard)
    @ApiRequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remoteLogoutBySessionId(
        @Param("sessionId") sessionId: string,
        @CurrentUser() user: AccessTokenPayload,
    ) {
        await this.authService.remoteLogoutBySessionId(sessionId, user);
    }
}
