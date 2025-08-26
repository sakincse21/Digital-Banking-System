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
const queryBuilder_1 = require("../../utils/queryBuilder");
const transaction_constant_1 = require("./transaction.constant");
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
//anyone can get his own transaction or the admin can get any transaction
const getSummary = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exists.");
    }
    const walletId = ifUserExists.phoneNo;
    // const userTransactions = Transaction.find({
    //     $or: [{ from: walletId }, { to: walletId }],
    //   });
    const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const summaryData = yield transaction_model_1.Transaction.aggregate([
        //search user
        {
            $match: {
                $and: [
                    { $or: [{ from: walletId }, { to: walletId }] },
                    { updatedAt: { $gte: pastDate } },
                ],
            },
        },
        //grouping based on type
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
            },
        },
        //projection with field names
        {
            $project: {
                Label: "$_id",
                Amount: "$totalAmount",
                Volume: "$count",
                _id: 0,
            },
        },
    ]);
    return summaryData;
});
//anyone can get his own transaction or the admin can get any transaction
const getAdminSummary = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exists.");
    }
    // console.log(ifUserExists)
    const initialFilter = {
        $or: [{ role: user_interface_1.IRole.USER }, { role: user_interface_1.IRole.AGENT }],
    };
    const agentCount = yield user_model_1.User.find(initialFilter).countDocuments({
        role: user_interface_1.IRole.AGENT,
    });
    const userCount = yield user_model_1.User.find(initialFilter).countDocuments({
        role: user_interface_1.IRole.USER,
    });
    const totalUsersCount = yield user_model_1.User.countDocuments(initialFilter);
    // const verifiedCount = await User.find(initialFilter).countDocuments({isVerified:true});
    // const unverifiedCount = await User.find(initialFilter).countDocuments({isVerified: false});
    const suspendedCount = yield user_model_1.User.find(initialFilter).countDocuments({
        status: user_interface_1.IStatus.SUSPENDED,
    });
    const activeCount = yield user_model_1.User.find(initialFilter).countDocuments({
        status: user_interface_1.IStatus.ACTIVE,
    });
    const deletedCount = yield user_model_1.User.find(initialFilter).countDocuments({
        status: user_interface_1.IStatus.DELETE,
    });
    const blockedCount = yield user_model_1.User.find(initialFilter).countDocuments({
        status: user_interface_1.IStatus.BLOCKED,
    });
    // const usersSummaryData = await U
    const usersAllCount = [
        // {
        //   Label: 'Verified',
        //   Amount: verifiedCount
        // },
        // {
        //   Label: 'Unverified',
        //   Amount: unverifiedCount
        // },
        {
            Label: "Suspended",
            Amount: suspendedCount,
        },
        {
            Label: "Active",
            Amount: activeCount,
        },
        {
            Label: "Deleted",
            Amount: deletedCount,
        },
        {
            Label: "Blocked",
            Amount: blockedCount,
        },
        {
            Label: "Total",
            Amount: totalUsersCount,
        },
    ];
    const roleData = [
        {
            Label: "Agents",
            Amount: agentCount,
        },
        {
            Label: "Users",
            Amount: userCount,
        },
    ];
    // console.log(usersAllCount)
    const summaryTransactionData = yield transaction_model_1.Transaction.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
            },
        },
        //projection with field names
        {
            $project: {
                Label: "$_id",
                Amount: "$totalAmount",
                Volume: "$count",
                _id: 0,
            },
        },
    ]);
    return [usersAllCount, summaryTransactionData, roleData];
});
//admins can get all the transactions or users can view their own all transactions
const getAllTransactions = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exists.");
    }
    const walletId = ifUserExists.phoneNo;
    // let allTransactions;
    let params;
    if (decodedToken.role === user_interface_1.IRole.ADMIN ||
        decodedToken.role === user_interface_1.IRole.SUPER_ADMIN) {
        // allTransactions = await Transaction.find({});
        params = {};
    }
    else {
        // allTransactions = await Transaction.find({
        //   $or: [{ from: walletId }, { to: walletId }],
        // });
        params = {
            $or: [{ from: walletId }, { to: walletId }],
        };
    }
    const queryBuilder = new queryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find(params), query);
    const usersData = queryBuilder
        .filter()
        .search(transaction_constant_1.transactionSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
    // return allTransactions;
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
const addMoneyConfirm = (transactionId, decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const ifTransactionExists = yield transaction_model_1.Transaction.findById(transactionId);
        if ((ifTransactionExists === null || ifTransactionExists === void 0 ? void 0 : ifTransactionExists.type) !== transaction_interface_1.ITransactionType.ADD_MONEY) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is not correct.");
        }
        if ((ifTransactionExists === null || ifTransactionExists === void 0 ? void 0 : ifTransactionExists.status) !== transaction_interface_1.ITransactionStatus.PENDING) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your operation is already processed.");
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
        if (!payload.consent) {
            ifTransactionExists.status = transaction_interface_1.ITransactionStatus.FAILED;
        }
        else {
            if (ifTransactionExists.amount > agentWallet.balance) {
                ifTransactionExists.status = transaction_interface_1.ITransactionStatus.FAILED;
                yield ifTransactionExists.save();
                throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "You do not have sufficient balance.");
            }
            userWallet.balance = userWallet.balance + ifTransactionExists.amount;
            agentWallet.balance = agentWallet.balance - ifTransactionExists.amount;
            ifTransactionExists.status = transaction_interface_1.ITransactionStatus.COMPLETED;
            yield agentWallet.save({ session });
            yield userWallet.save({ session });
        }
        yield ifTransactionExists.save({ session });
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
        if (decodedToken.role === user_interface_1.IRole.AGENT) {
            yield (0, transaction_utils_1.agentValidator)(ifReceiverExists);
        }
        else {
            yield (0, transaction_utils_1.userValidator)(ifReceiverExists);
        }
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
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Original receiver wallet does not exist.");
        }
        if (amount > senderWallet.balance) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Original receiver do not have sufficient balance for refund.");
        }
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ walletId: to });
        if (!receiverWallet) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Original sender wallet does not exist.");
        }
        receiverWallet.balance = receiverWallet.balance + amount;
        senderWallet.balance = senderWallet.balance - amount;
        ifTransactionExists.status = transaction_interface_1.ITransactionStatus.REFUNDED;
        yield ifTransactionExists.save({ session });
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
    getSummary,
    getAdminSummary,
};
