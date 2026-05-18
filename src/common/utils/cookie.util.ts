import { Response } from "express";

export function setAccessTokenCookie(accessToken: string, res: Response) {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
}

export function clearAccessTokenCookie(res: Response) {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
}

export function setRefreshTokenCookie(refreshToken: string, res: Response) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export function clearRefreshTokenCookie(res: Response) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/auth/refresh",
    });
}
