import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AuthServices } from "./auth.service";
import httpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookies";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {user, accessToken} = await AuthServices.login(req.body)

    setAuthCookie(res,accessToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: {...user, accessToken}
    })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    setAuthCookie(res,"")

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null
    })
})

export const AuthControllers = {
    login,
    logout
}