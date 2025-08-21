"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, token) => {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    // if (tokenInfo.refreshToken) {
    //     res.cookie("refreshToken", tokenInfo.refreshToken, {
    //         httpOnly: true,
    //         secure: envVars.NODE_ENV === "production",
    //         sameSite: "none"
    //     })
    // }
};
exports.setAuthCookie = setAuthCookie;
