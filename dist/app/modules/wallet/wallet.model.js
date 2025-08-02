"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    balance: {
        type: Number,
        min: 0,
        default: 50,
        required: true
    },
    walletId: {
        type: String,
        ref: "User",
        required: true,
        unique: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    transactionId: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Transaction'
    }
});
exports.Wallet = (0, mongoose_1.model)('Wallet', WalletSchema);
