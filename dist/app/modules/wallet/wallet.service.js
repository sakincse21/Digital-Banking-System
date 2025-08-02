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
exports.WalletServices = void 0;
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const wallet_model_1 = require("./wallet.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
//admins can update wallet's walletId(phone) and balance
const updateWallet = (walletId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ifWalletExist = yield wallet_model_1.Wallet.findById(walletId);
    if (!ifWalletExist) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    if (payload.walletId) {
        ifWalletExist.walletId = payload.walletId;
    }
    if (payload.balance) {
        ifWalletExist.balance = payload.balance;
    }
    yield ifWalletExist.save();
    return ifWalletExist.toObject;
});
//anyone can get his wallet info and admins can get anyones wallet info
const getSingleWallet = (walletId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    if (ifUserExists.role !== user_interface_1.IRole.ADMIN && ifUserExists.role !== user_interface_1.IRole.SUPER_ADMIN) {
        if (ifUserExists.walletId.toString() !== walletId) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You do not have permission for this operation.");
        }
    }
    const wallet = yield wallet_model_1.Wallet.findById(walletId).populate("transactionId");
    if (!wallet) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Wallet does not exist.");
    }
    return wallet.toObject();
});
//anyone can get his wallet info and admins can get anyones wallet info
const getWalletByPhone = (walletId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExists = yield user_model_1.User.findById(decodedToken.userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ walletId }).populate("transactionId");
    if (!wallet) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Wallet does not exist.");
    }
    if (ifUserExists.role !== user_interface_1.IRole.ADMIN && ifUserExists.role !== user_interface_1.IRole.SUPER_ADMIN) {
        if (ifUserExists.walletId.toString() !== (wallet === null || wallet === void 0 ? void 0 : wallet._id.toString())) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You do not have permission for this operation.");
        }
    }
    return wallet.toObject();
});
//admins can get all wallets info
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find({});
    return wallets;
});
exports.WalletServices = {
    updateWallet,
    getSingleWallet,
    getAllWallets,
    getWalletByPhone
};
