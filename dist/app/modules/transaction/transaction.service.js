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
const amountChecker_1 = require("../../utils/amountChecker");
//anyone can get his own transaction or the admin can get any transaction
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
    return ifTransactionExists.toObject();
});
//admins can get all the transactions or users can view their own all transactions
const getAllTransactions = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exists.");
    }
    const walletId = ifUserExists.phoneNo;
    let allTransactions;
    if (decodedToken.role === user_interface_1.IRole.ADMIN ||
        decodedToken.role === user_interface_1.IRole.SUPER_ADMIN) {
        allTransactions = yield transaction_model_1.Transaction.find({});
    }
    else {
        allTransactions = yield transaction_model_1.Transaction.find({
            $or: [{ from: walletId }, { to: walletId }],
        });
    }
    return allTransactions;
});
//users can request for add money to any agent. if agent accepts, transaction completes
const addMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        (0, amountChecker_1.amountCheck)(amount);
        const ifAgentExists = yield user_model_1.User.findOne({ phoneNo: toPhone });
        yield (0, transaction_utils_1.agentValidator)(ifAgentExists);
        const agentWallet = yield wallet_model_1.Wallet.findById(ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists.walletId);
        if (type !== transaction_interface_1.ITransactionType.ADD_MONEY) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        const user = yield user_model_1.User.findById(decodedToken.userId);
        const userWallet = yield wallet_model_1.Wallet.findById(user === null || user === void 0 ? void 0 : user.walletId);
        const transaction = yield transaction_model_1.Transaction.create([
            {
                from: userWallet === null || userWallet === void 0 ? void 0 : userWallet.walletId,
                to: agentWallet === null || agentWallet === void 0 ? void 0 : agentWallet.walletId,
                amount,
                type,
            },
        ], { session });
        userWallet === null || userWallet === void 0 ? void 0 : userWallet.transactionId.push(transaction[0]._id);
        agentWallet === null || agentWallet === void 0 ? void 0 : agentWallet.transactionId.push(transaction[0]._id);
        yield (userWallet === null || userWallet === void 0 ? void 0 : userWallet.save({ session }));
        yield (agentWallet === null || agentWallet === void 0 ? void 0 : agentWallet.save({ session }));
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
//agent can confirm the add money request send to him from any user.
const addMoneyConfirm = (transactionId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const ifTransactionExists = yield transaction_model_1.Transaction.findById(transactionId);
        if ((ifTransactionExists === null || ifTransactionExists === void 0 ? void 0 : ifTransactionExists.type) !== transaction_interface_1.ITransactionType.ADD_MONEY) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        if ((ifTransactionExists === null || ifTransactionExists === void 0 ? void 0 : ifTransactionExists.status) === transaction_interface_1.ITransactionStatus.COMPLETED) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is already completed.");
        }
        const user = yield user_model_1.User.findOne({ phoneNo: ifTransactionExists.from });
        yield (0, transaction_utils_1.userValidator)(user);
        const userWallet = yield wallet_model_1.Wallet.findById(user === null || user === void 0 ? void 0 : user.walletId);
        if (!userWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User wallet does not exist.");
        }
        const agent = yield user_model_1.User.findById(decodedToken.userId);
        yield (0, transaction_utils_1.agentValidator)(agent);
        if (ifTransactionExists.to !== (agent === null || agent === void 0 ? void 0 : agent.phoneNo)) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "This transaction is not made to you.");
        }
        const agentWallet = yield wallet_model_1.Wallet.findById(agent === null || agent === void 0 ? void 0 : agent.walletId);
        if (!agentWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your wallet does not exist.");
        }
        if (ifTransactionExists.amount > agentWallet.balance) {
            ifTransactionExists.status = transaction_interface_1.ITransactionStatus.FAILED;
            yield ifTransactionExists.save();
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
        return ifTransactionExists.toObject();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
//any user can withdraw money anytime through an agent number
const withdrawMoney = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        (0, amountChecker_1.amountCheck)(amount);
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
                from: userWallet.walletId,
                to: agentWallet.walletId,
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
//an agent can cash in the money to any user anytime
const cashIn = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { to: toPhone, type, amount } = payload;
        (0, amountChecker_1.amountCheck)(amount);
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
                from: agentWallet.walletId,
                to: userWallet.walletId,
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
//sendMoney can send any amount to anyone of his role if balance is equal or more.
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
                from: senderWallet.walletId,
                to: receiverWallet.walletId,
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
//admins can proceed to refund any completed transactions
const refund = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const ifTransactionExists = yield transaction_model_1.Transaction.findById(transactionId);
        if (!ifTransactionExists) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Transaction does not exist.");
        }
        const { from: to, to: from, status, amount } = ifTransactionExists;
        // const ifReceiverExists = await User.findOne({phoneNo:to})
        // await anyValidator(ifReceiverExists);
        // const ifSenderExists = await User.findOne({phoneNo:from})
        // await anyValidator(ifSenderExists);
        if (status === transaction_interface_1.ITransactionStatus.PENDING ||
            status === transaction_interface_1.ITransactionStatus.REFUNDED ||
            status === transaction_interface_1.ITransactionStatus.FAILED) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        const senderWallet = yield wallet_model_1.Wallet.findOne({ walletId: from });
        if (!senderWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "sender wallet does not exist.");
        }
        if (amount > senderWallet.balance) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Sender do not have sufficient balance.");
        }
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ walletId: to });
        if (!receiverWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Receiver wallet does not exist.");
        }
        receiverWallet.balance = receiverWallet.balance + amount;
        senderWallet.balance = senderWallet.balance - amount;
        ifTransactionExists.status = transaction_interface_1.ITransactionStatus.REFUNDED;
        ifTransactionExists.save({ session });
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return ifTransactionExists.toObject();
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
    refund,
};
