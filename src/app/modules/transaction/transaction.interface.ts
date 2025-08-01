import { Types } from "mongoose";

export enum ITransactionStatus{
    PENDING="PENDING",
    COMPLETED="COMPLETED",
    REFUNDED='REFUNDED',
    FAILED = "FAILED"
}

export enum ITransactionType{
    SEND_MONEY="SEND_MONEY",
    ADD_MONEY="ADD_MONEY",
    WITHDRAW="WITHDRAW",
    CASH_IN="CASH_IN",
    CASH_OUT="CASH_OUT",
    REFUND="REFUND"
}
export interface ITransaction{
    from: Types.ObjectId;
    to: Types.ObjectId;
    amount: number;
    status: ITransactionStatus;
    type: ITransactionType
}