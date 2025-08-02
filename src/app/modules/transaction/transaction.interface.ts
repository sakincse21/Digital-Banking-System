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
    REFUND="REFUND"
}
export interface ITransaction{
    from: string;
    to: string;
    amount: number;
    status: ITransactionStatus;
    type: ITransactionType;
}