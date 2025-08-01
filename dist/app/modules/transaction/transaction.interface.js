"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITransactionType = exports.ITransactionStatus = void 0;
var ITransactionStatus;
(function (ITransactionStatus) {
    ITransactionStatus["PENDING"] = "PENDING";
    ITransactionStatus["COMPLETED"] = "COMPLETED";
    ITransactionStatus["REFUNDED"] = "REFUNDED";
    ITransactionStatus["FAILED"] = "FAILED";
})(ITransactionStatus || (exports.ITransactionStatus = ITransactionStatus = {}));
var ITransactionType;
(function (ITransactionType) {
    ITransactionType["SEND_MONEY"] = "SEND_MONEY";
    ITransactionType["ADD_MONEY"] = "ADD_MONEY";
    ITransactionType["WITHDRAW"] = "WITHDRAW";
    ITransactionType["CASH_IN"] = "CASH_IN";
    ITransactionType["REFUND"] = "REFUND";
})(ITransactionType || (exports.ITransactionType = ITransactionType = {}));
