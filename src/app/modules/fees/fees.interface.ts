import { Types } from "mongoose";

export interface IFees{
    transactionId: Types.ObjectId,
    amount: number
}