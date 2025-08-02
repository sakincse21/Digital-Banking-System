import { Types } from "mongoose";


export interface IWallet{
    balance: number;
    transactionId: Types.ObjectId[];
    userId: Types.ObjectId;
    _id: Types.ObjectId;
    walletId: string;
}