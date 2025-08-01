"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const TransactionSchema = new mongoose_1.Schema({
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        min: 0
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
});
exports.Transaction = (0, mongoose_1.model)("Transaction", TransactionSchema);
