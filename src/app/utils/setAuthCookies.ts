import { Response } from "express"
import { envVars } from "../config/env"

export const setAuthCookie = (res: Response, token: string) => {
    if (token) {
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        })
    }

    // if (tokenInfo.refreshToken) {
    //     res.cookie("refreshToken", tokenInfo.refreshToken, {
    //         httpOnly: true,
    //         secure: envVars.NODE_ENV === "production",
    //         sameSite: "none"
    //     })
    // }
}