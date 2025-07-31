import { Types } from "mongoose";


export interface IWallet{
    balance: number;
    transactionId: Types.ObjectId[]
}