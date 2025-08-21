import { Response } from "express";

export const setAuthCookie = (res: Response, token: string) => {
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
