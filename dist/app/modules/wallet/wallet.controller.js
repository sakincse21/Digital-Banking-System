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
exports.WalletControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../utils/sendResponse");
const wallet_service_1 = require("./wallet.service");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.id;
    const wallet = yield wallet_service_1.WalletServices.updateWallet(walletId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wallet Updated Successfully",
        data: wallet,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.id;
    const decodedToken = req.user;
    const wallet = yield wallet_service_1.WalletServices.getSingleWallet(walletId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wallet Fetched Successfully",
        data: wallet,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWalletByPhone = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.phone;
    const decodedToken = req.user;
    const wallet = yield wallet_service_1.WalletServices.getWalletByPhone(walletId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Wallet Fetched Successfully",
        data: wallet,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.WalletServices.getAllWallets();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All Wallets Fetched Successfully",
        data: wallet,
    });
}));
exports.WalletControllers = {
    updateWallet,
    getWallet,
    getAllWallets,
    getWalletByPhone
};
