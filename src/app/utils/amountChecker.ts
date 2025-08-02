import AppError from "../errorHelpers/appErrorHandler";
import httpStatus from 'http-status';

export const amountCheck = (amount: number)=>{
    if(amount<50){
        throw new AppError(httpStatus.BAD_REQUEST,"Transaction amount cannot be less than 50.")
    }
}