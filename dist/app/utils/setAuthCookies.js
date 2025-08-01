"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, token) => {
    if (token) {
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "production",
            sameSite: "none"
        });
    }
    // if (tokenInfo.refreshToken) {
    //     res.cookie("refreshToken", tokenInfo.refreshToken, {
    //         httpOnly: true,
    //         secure: envVars.NODE_ENV === "production",
    //         sameSite: "none"
    //     })
    // }
};
exports.setAuthCookie = setAuthCookie;
