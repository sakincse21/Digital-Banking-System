"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const transaction_service_1 = require("./transaction.service");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleTransaction = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.params.id;
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.getSingleTransaction(transactionId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Transaction Fetched Successfully",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSummary = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transaction = yield transaction_service_1.TransactionServices.getSummary(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Transactions Summary Fetched Successfully",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAdminSummary = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const summaryData = yield transaction_service_1.TransactionServices.getAdminSummary(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Transactions Summary Fetched Successfully",
        data: summaryData,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllTransactions = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const allTransactions = yield transaction_service_1.TransactionServices.getAllTransactions(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Transactions Fetched Successfully",
        data: allTransactions,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = yield transaction_service_1.TransactionServices.addMoney(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Transaction Created Successfully. Wait for agent's approval.",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addMoneyConfirm = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transactionId = req.params.id;
    const payload = req.body;
    const transaction = yield transaction_service_1.TransactionServices.addMoneyConfirm(transactionId, decodedToken, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Added money successfully.",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const withdrawMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = yield transaction_service_1.TransactionServices.withdrawMoney(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Money withdrawn successfully.",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cashIn = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = yield transaction_service_1.TransactionServices.cashIn(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Money Cashed In successfully.",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sendMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = yield transaction_service_1.TransactionServices.sendMoney(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Money Sent successfully.",
        data: transaction,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const refund = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.params.id;
    const transaction = yield transaction_service_1.TransactionServices.refund(transactionId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Money Refunded successfully.",
        data: transaction,
    });
}));
exports.TransactionControllers = {
    getSingleTransaction,
    addMoney,
    getAllTransactions,
    withdrawMoney,
    cashIn,
    sendMoney,
    addMoneyConfirm,
    refund,
    getSummary,
    getAdminSummary
};
