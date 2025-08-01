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
exports.TransactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const user_interface_1 = require("../user/user.interface");
const transaction_interface_1 = require("./transaction.interface");
const user_model_1 = require("../user/user.model");
const transaction_utils_1 = require("./transaction.utils");
const wallet_model_1 = require("../wallet/wallet.model");
const getSingleTransaction = (transactionId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifTransactionExists = yield transaction_model_1.Transaction.findById(transactionId);
    if (!ifTransactionExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Transaction ID does not exist.");
    }
    if (ifTransactionExists.from.toString() !== decodedToken.userId &&
        ifTransactionExists.to.toString() !== decodedToken.userId) {
        if (decodedToken.role !== user_interface_1.IRole.ADMIN &&
            decodedToken.role !== user_interface_1.IRole.SUPER_ADMIN) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not permitted for this operation.");
        }
    }
    return ifTransactionExists;
});
const getAllTransactions = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    let allTransactions;
    if (decodedToken.role === user_interface_1.IRole.ADMIN ||
        decodedToken.role === user_interface_1.IRole.SUPER_ADMIN) {
        allTransactions = yield transaction_model_1.Transaction.find({});
    }
    else {
        allTransactions = yield transaction_model_1.Transaction.find({
            $or: [{ from: userId }, { to: userId }],
        });
    }
    // if(!ifTransactionExists){
    //     throw new AppError(httpStatus.BAD_REQUEST, "Transaction ID does not exist.")
    // }
    //   if (
    //     decodedToken.role !== IRole.ADMIN &&
    //     decodedToken.role !== IRole.SUPER_ADMIN
    //   ) {
    //     throw new AppError(
    //       httpStatus.UNAUTHORIZED,
    //       "You are not permitted for this operation."
    //     );
    //   }
    return allTransactions;
});
//addmoney te user request korbe, then agent api diye accept korle completed else refunded
const addMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        const ifAgentExists = yield user_model_1.User.findOne({ phoneNo: toPhone });
        yield (0, transaction_utils_1.agentValidator)(ifAgentExists);
        const agentWallet = yield wallet_model_1.Wallet.findById(ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists.walletId);
        if (type !== transaction_interface_1.ITransactionType.ADD_MONEY) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        const user = yield user_model_1.User.findById(decodedToken.userId);
        const userWallet = yield wallet_model_1.Wallet.findById(user === null || user === void 0 ? void 0 : user.walletId);
        const transaction = yield transaction_model_1.Transaction.create([{
                from: decodedToken.userId,
                to: ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists._id,
                amount,
                type,
            }], { session });
        userWallet === null || userWallet === void 0 ? void 0 : userWallet.transactionId.push(transaction[0]._id);
        agentWallet === null || agentWallet === void 0 ? void 0 : agentWallet.transactionId.push(transaction[0]._id);
        yield (userWallet === null || userWallet === void 0 ? void 0 : userWallet.save({ session }));
        yield (agentWallet === null || agentWallet === void 0 ? void 0 : agentWallet.save({ session }));
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const addMoneyConfirm = (transactionId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const ifTransactionExists = yield transaction_model_1.Transaction.findById(transactionId);
        if ((ifTransactionExists === null || ifTransactionExists === void 0 ? void 0 : ifTransactionExists.type) !== transaction_interface_1.ITransactionType.ADD_MONEY) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        const user = yield user_model_1.User.findById(ifTransactionExists.from);
        yield (0, transaction_utils_1.userValidator)(user);
        const userWallet = yield wallet_model_1.Wallet.findById(user === null || user === void 0 ? void 0 : user.walletId);
        if (!userWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User wallet does not exist.");
        }
        const agent = yield user_model_1.User.findById(decodedToken.userId);
        yield (0, transaction_utils_1.agentValidator)(agent);
        const agentWallet = yield wallet_model_1.Wallet.findById(agent === null || agent === void 0 ? void 0 : agent.walletId);
        if (!agentWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your wallet does not exist.");
        }
        if (ifTransactionExists.amount > agentWallet.balance) {
            ifTransactionExists.status = transaction_interface_1.ITransactionStatus.FAILED;
            yield ifTransactionExists.save({ session });
            yield session.commitTransaction();
            session.endSession();
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "You do not have sufficient balance.");
        }
        userWallet.balance = userWallet.balance + ifTransactionExists.amount;
        agentWallet.balance = agentWallet.balance - ifTransactionExists.amount;
        ifTransactionExists.status = transaction_interface_1.ITransactionStatus.COMPLETED;
        yield ifTransactionExists.save({ session });
        yield agentWallet.save({ session });
        yield userWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return ifTransactionExists;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const withdrawMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        const ifAgentExists = yield user_model_1.User.findOne({ phoneNo: toPhone });
        yield (0, transaction_utils_1.agentValidator)(ifAgentExists);
        if (type !== transaction_interface_1.ITransactionType.WITHDRAW) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        const user = yield user_model_1.User.findById(decodedToken.userId);
        const userWallet = yield wallet_model_1.Wallet.findById(user === null || user === void 0 ? void 0 : user.walletId);
        if (!userWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your wallet does not exist.");
        }
        if (amount > userWallet.balance) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "You do not have sufficient balance.");
        }
        const agentWallet = yield wallet_model_1.Wallet.findById(ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists.walletId);
        if (!agentWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Agent wallet does not exist.");
        }
        const transaction = yield transaction_model_1.Transaction.create([
            {
                from: decodedToken.userId,
                to: ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists._id,
                amount,
                type,
                status: transaction_interface_1.ITransactionStatus.COMPLETED,
            },
        ], { session });
        userWallet.balance = userWallet.balance - amount;
        agentWallet.balance = agentWallet.balance + amount;
        yield agentWallet.save({ session });
        yield userWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0].toObject();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
//FIX CASHIN
const cashIn = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        const ifUserExists = yield user_model_1.User.findOne({ phoneNo: toPhone });
        yield (0, transaction_utils_1.userValidator)(ifUserExists);
        if (type !== transaction_interface_1.ITransactionType.CASH_IN) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        const agent = yield user_model_1.User.findById(decodedToken.userId);
        const agentWallet = yield wallet_model_1.Wallet.findById(agent === null || agent === void 0 ? void 0 : agent.walletId);
        if (!agentWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your wallet does not exist.");
        }
        if (amount > agentWallet.balance) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "You do not have sufficient balance.");
        }
        const userWallet = yield wallet_model_1.Wallet.findById(ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.walletId);
        if (!userWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User wallet does not exist.");
        }
        const transaction = yield transaction_model_1.Transaction.create([
            {
                from: decodedToken.userId,
                to: ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists._id,
                amount,
                type,
                status: transaction_interface_1.ITransactionStatus.COMPLETED,
            },
        ], { session });
        userWallet.balance = userWallet.balance + amount;
        agentWallet.balance = agentWallet.balance - amount;
        yield agentWallet.save({ session });
        yield userWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0].toObject();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
//FIX sendMoney
const sendMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        const ifReceiverExists = yield user_model_1.User.findOne({ phoneNo: toPhone });
        yield (0, transaction_utils_1.userValidator)(ifReceiverExists);
        if (decodedToken.userId === (ifReceiverExists === null || ifReceiverExists === void 0 ? void 0 : ifReceiverExists._id.toString())) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "You cannot send money to your own wallet.");
        }
        if (type !== transaction_interface_1.ITransactionType.SEND_MONEY) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        if (decodedToken.role !== (ifReceiverExists === null || ifReceiverExists === void 0 ? void 0 : ifReceiverExists.role.toString())) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, `${decodedToken.role} can only send money to another ${decodedToken.role}`);
        }
        const sender = yield user_model_1.User.findById(decodedToken.userId);
        const senderWallet = yield wallet_model_1.Wallet.findById(sender === null || sender === void 0 ? void 0 : sender.walletId);
        if (!senderWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your wallet does not exist.");
        }
        if (amount > senderWallet.balance) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "You do not have sufficient balance.");
        }
        const receiverWallet = yield wallet_model_1.Wallet.findById(ifReceiverExists === null || ifReceiverExists === void 0 ? void 0 : ifReceiverExists.walletId);
        if (!receiverWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Receiver wallet does not exist.");
        }
        const transaction = yield transaction_model_1.Transaction.create([
            {
                from: decodedToken.userId,
                to: ifReceiverExists === null || ifReceiverExists === void 0 ? void 0 : ifReceiverExists._id,
                amount,
                type,
                status: transaction_interface_1.ITransactionStatus.COMPLETED,
            },
        ], { session });
        receiverWallet.balance = receiverWallet.balance + amount;
        senderWallet.balance = senderWallet.balance - amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return transaction[0].toObject();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.TransactionServices = {
    getSingleTransaction,
    getAllTransactions,
    addMoney,
    withdrawMoney,
    cashIn,
    sendMoney,
    addMoneyConfirm,
};
