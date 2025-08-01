import { model, Schema } from "mongoose";
import { ITransaction, ITransactionStatus, ITransactionType } from "./transaction.interface";

const TransactionSchema = new Schema<ITransaction>({
    from:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    to:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    amount:{
        type: Number,
        min:0
    },
    type:{
        type: String,
        enum: Object.values(ITransactionType),
        required: true,
    },
    status:{
        type: String,
        enum: Object.values(ITransactionStatus),
        required: true,
        default: ITransactionStatus.PENDING
    }
})

export const Transaction = model<ITransaction>("Transaction",TransactionSchema)