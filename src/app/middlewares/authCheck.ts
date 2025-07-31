import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import AppError from "../utils/errorHandler";
import httpStatus from 'http-status';
import { User } from "../modules/user/user.model";
import { IStatus } from "../modules/user/user.interface";

export const authCheck = (...authRoles: string[]) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = req.headers.authorization;
    // const accessToken = req.cookies?.accessToken;

    

    if(!accessToken){
        throw new AppError(httpStatus.UNAUTHORIZED, "No token provided")
    }

    const verifiedToken = verifyToken(accessToken as string)
    
    if(!verifiedToken){
        throw new AppError(httpStatus.UNAUTHORIZED,"User is not authorized.")
    }

    const ifUserExitst = await User.findById(verifiedToken.userId)

    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(httpStatus.UNAUTHORIZED, "You do not have permission to access the endpoint.")
    }

    if(ifUserExitst?.status==IStatus.BLOCKED || ifUserExitst?.status===IStatus.SUSPENDED || ifUserExitst?.status===IStatus.DELETE){
        throw new AppError(httpStatus.BAD_REQUEST,"Your account is Blocked/Suspended. Contact support team.")
    }

    req.user=verifiedToken;

    next();
})