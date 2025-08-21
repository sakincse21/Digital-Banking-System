"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
// import AppError from "../../errorHelpers/appErrorHandler";
// import httpStatus from 'http-status';
const TransactionSchema = new mongoose_1.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        min: 5,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.ITransactionType),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transaction_interface_1.ITransactionStatus),
        required: true,
        default: transaction_interface_1.ITransactionStatus.PENDING
    }
}, {
    timestamps: true,
    versionKey: false
});
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
exports.Transaction = (0, mongoose_1.model)("Transaction", TransactionSchema);
