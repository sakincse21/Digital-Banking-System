import AppError from "../../errorHelpers/appErrorHandler";
import { User } from "../user/user.model"
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs'
import { generateToken } from "../../utils/jwt";

const login = async (payload:Record<string,string>)=>{
    const ifUserExists = await User.findOne({email: payload.email});

    if(!ifUserExists){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist. Register first.")
    }

    const passComparison = await bcrypt.compare(payload.password, ifUserExists.password)

    if(!passComparison){
        throw new AppError(httpStatus.BAD_REQUEST, "Password does not match.")
    }

    const jwtPayload = {
        userId: ifUserExists._id,
        role: ifUserExists.role,
        email: ifUserExists.email,
        walletId: ifUserExists.walletId
    }

    const accessToken = generateToken(jwtPayload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...user} = ifUserExists.toObject();
    
    return {
        accessToken,
        user
    }
}

export const AuthServices = {
    login
}