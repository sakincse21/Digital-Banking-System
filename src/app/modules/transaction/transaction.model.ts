import { model, Schema } from "mongoose";
import { ITransaction, ITransactionStatus, ITransactionType } from "./transaction.interface";
// import AppError from "../../errorHelpers/appErrorHandler";
// import httpStatus from 'http-status';

const TransactionSchema = new Schema<ITransaction>({
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        min: 5,
        required: true,
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

// TransactionSchema.pre("save", async function (next) {
//   const transaction = this as ITransaction;

//   if (transaction.type === ITransactionType.SEND_MONEY && transaction.amount < 5) {
//     return next(new AppError(httpStatus.BAD_REQUEST, "Minimum Send Money amount is 5TK."));
//   }
//   if (transaction.type!==ITransactionType.SEND_MONEY && transaction.amount < 50) {
//     return next(new AppError(httpStatus.BAD_REQUEST, "Minimum transaction amount is 50TK."));
//   }

//   return next();
// });

export const Transaction = model<ITransaction>("Transaction",TransactionSchema)