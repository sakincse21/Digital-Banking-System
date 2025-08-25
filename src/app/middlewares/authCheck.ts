import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import AppError from "../errorHelpers/appErrorHandler";
import httpStatus from 'http-status';
import { User } from "../modules/user/user.model";
import { IStatus } from "../modules/user/user.interface";

export const authCheck = (...authRoles: string[]) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =  req.cookies.accessToken || req.headers.authorization;
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

    if(!ifUserExitst?.isVerified){
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not verified yet. Contact support.")
    }

    req.user=verifiedToken;

    next();
})
