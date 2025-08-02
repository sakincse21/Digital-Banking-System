import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "./transaction.model";
import AppError from "../../errorHelpers/appErrorHandler";
import httpStatus from "http-status";
import { IRole } from "../user/user.interface";
import {
  ITransaction,
  ITransactionStatus,
  ITransactionType,
} from "./transaction.interface";
import { User } from "../user/user.model";
import { agentValidator, userValidator } from "./transaction.utils";
import { Wallet } from "../wallet/wallet.model";
import { amountCheck } from "../../utils/amountChecker";

//anyone can get his own transaction or the admin can get any transaction
const getSingleTransaction = async (
  transactionId: string,
  decodedToken: JwtPayload
) => {
  const ifTransactionExists = await Transaction.findById(transactionId);
  if (!ifTransactionExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Transaction ID does not exist."
    );
  }
  if (
    ifTransactionExists.from.toString() !== decodedToken.userId &&
    ifTransactionExists.to.toString() !== decodedToken.userId
  ) {
    if (
      decodedToken.role !== IRole.ADMIN &&
      decodedToken.role !== IRole.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not permitted for this operation."
      );
    }
  }
  return ifTransactionExists.toObject();
};

//admins can get all the transactions or users can view their own all transactions
const getAllTransactions = async (decodedToken: JwtPayload) => {
  const userId = decodedToken.userId;
  const ifUserExists = await User.findById(userId)
  if(!ifUserExists){
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists.")
  }
  const walletId = ifUserExists.phoneNo
  let allTransactions;
  if (
    decodedToken.role === IRole.ADMIN ||
    decodedToken.role === IRole.SUPER_ADMIN
  ) {
    allTransactions = await Transaction.find({});
  } else {
    allTransactions = await Transaction.find({
      $or: [{ from: walletId }, { to: walletId }],
    });
  }

  return allTransactions;
};

//users can request for add money to any agent. if agent accepts, transaction completes
const addMoney = async (payload: ITransaction, decodedToken: JwtPayload) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { to: toPhone, type, amount } = payload;
    amountCheck(amount);
    const ifAgentExists = await User.findOne({ phoneNo: toPhone });
    await agentValidator(ifAgentExists);
    const agentWallet = await Wallet.findById(ifAgentExists?.walletId);
    if (type !== ITransactionType.ADD_MONEY) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is not correct."
      );
    }
    const user = await User.findById(decodedToken.userId);
    const userWallet = await Wallet.findById(user?.walletId);

    const transaction = await Transaction.create(
      [
        {
          from: userWallet?.walletId,
          to: agentWallet?.walletId,
          amount,
          type,
        },
      ],
      { session }
    );
    userWallet?.transactionId.push(transaction[0]._id);
    agentWallet?.transactionId.push(transaction[0]._id);
    await userWallet?.save({ session });
    await agentWallet?.save({ session });
    await session.commitTransaction();
    session.endSession();
    return transaction[0].toObject();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//agent can confirm the add money request send to him from any user.
const addMoneyConfirm = async (
  transactionId: string,
  decodedToken: JwtPayload
) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const ifTransactionExists = await Transaction.findById(transactionId);
    if (ifTransactionExists?.type !== ITransactionType.ADD_MONEY) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is not correct."
      );
    }
    if (ifTransactionExists?.status === ITransactionStatus.COMPLETED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is already completed."
      );
    }
    const user = await User.findOne({ phoneNo: ifTransactionExists.from });
    await userValidator(user);
    const userWallet = await Wallet.findById(user?.walletId);

    if (!userWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "User wallet does not exist.");
    }
    const agent = await User.findById(decodedToken.userId);
    await agentValidator(agent);

    if (ifTransactionExists.to !== agent?.phoneNo) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This transaction is not made to you."
      );
    }

    const agentWallet = await Wallet.findById(agent?.walletId);

    if (!agentWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Your wallet does not exist.");
    }
    if (ifTransactionExists.amount > agentWallet.balance) {
      ifTransactionExists.status = ITransactionStatus.FAILED;

      await ifTransactionExists.save();

      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You do not have sufficient balance."
      );
    }

    userWallet.balance = userWallet.balance + ifTransactionExists.amount;
    agentWallet.balance = agentWallet.balance - ifTransactionExists.amount;
    ifTransactionExists.status = ITransactionStatus.COMPLETED;

    await ifTransactionExists.save({ session });
    await agentWallet.save({ session });
    await userWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return ifTransactionExists.toObject();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//any user can withdraw money anytime through an agent number
const withdrawMoney = async (
  payload: ITransaction,
  decodedToken: JwtPayload
) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { to: toPhone, type, amount } = payload;
    amountCheck(amount);
    const ifAgentExists = await User.findOne({ phoneNo: toPhone });
    await agentValidator(ifAgentExists);
    if (type !== ITransactionType.WITHDRAW) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is not correct."
      );
    }
    const user = await User.findById(decodedToken.userId);
    const userWallet = await Wallet.findById(user?.walletId);
    if (!userWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Your wallet does not exist.");
    }
    if (amount > userWallet.balance) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You do not have sufficient balance."
      );
    }
    const agentWallet = await Wallet.findById(ifAgentExists?.walletId);
    if (!agentWallet) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Agent wallet does not exist."
      );
    }

    const transaction = await Transaction.create(
      [
        {
          from: userWallet.walletId,
          to: agentWallet.walletId,
          amount,
          type,
          status: ITransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    userWallet.balance = userWallet.balance - amount;
    agentWallet.balance = agentWallet.balance + amount;

    await agentWallet.save({ session });
    await userWallet.save({ session });

    await session.commitTransaction();
    session.endSession();
    return transaction[0].toObject();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//an agent can cash in the money to any user anytime
const cashIn = async (payload: ITransaction, decodedToken: JwtPayload) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { to: toPhone, type, amount } = payload;
    amountCheck(amount);
    const ifUserExists = await User.findOne({ phoneNo: toPhone });
    await userValidator(ifUserExists);
    if (type !== ITransactionType.CASH_IN) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is not correct."
      );
    }
    const agent = await User.findById(decodedToken.userId);
    const agentWallet = await Wallet.findById(agent?.walletId);
    if (!agentWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Your wallet does not exist.");
    }
    if (amount > agentWallet.balance) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You do not have sufficient balance."
      );
    }
    const userWallet = await Wallet.findById(ifUserExists?.walletId);
    if (!userWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "User wallet does not exist.");
    }

    const transaction = await Transaction.create(
      [
        {
          from: agentWallet.walletId,
          to: userWallet.walletId,
          amount,
          type,
          status: ITransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    userWallet.balance = userWallet.balance + amount;
    agentWallet.balance = agentWallet.balance - amount;

    await agentWallet.save({ session });
    await userWallet.save({ session });
    await session.commitTransaction();
    session.endSession();
    return transaction[0].toObject();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//sendMoney can send any amount to anyone of his role if balance is equal or more.
const sendMoney = async (payload: ITransaction, decodedToken: JwtPayload) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { to: toPhone, type, amount } = payload;
    const ifReceiverExists = await User.findOne({ phoneNo: toPhone });
    await userValidator(ifReceiverExists);

    if (decodedToken.userId === ifReceiverExists?._id.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot send money to your own wallet."
      );
    }
    if (type !== ITransactionType.SEND_MONEY) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is not correct."
      );
    }
    if (decodedToken.role !== ifReceiverExists?.role.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${decodedToken.role} can only send money to another ${decodedToken.role}`
      );
    }
    const sender = await User.findById(decodedToken.userId);
    const senderWallet = await Wallet.findById(sender?.walletId);
    if (!senderWallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Your wallet does not exist.");
    }
    if (amount > senderWallet.balance) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You do not have sufficient balance."
      );
    }
    const receiverWallet = await Wallet.findById(ifReceiverExists?.walletId);
    if (!receiverWallet) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Receiver wallet does not exist."
      );
    }

    const transaction = await Transaction.create(
      [
        {
          from: senderWallet.walletId,
          to: receiverWallet.walletId,
          amount,
          type,
          status: ITransactionStatus.COMPLETED,
        },
      ],
      { session }
    );

    receiverWallet.balance = receiverWallet.balance + amount;
    senderWallet.balance = senderWallet.balance - amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });
    await session.commitTransaction();
    session.endSession();
    return transaction[0].toObject();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//admins can proceed to refund any completed transactions
const refund = async (transactionId: string) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const ifTransactionExists = await Transaction.findById(transactionId);
    if (!ifTransactionExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Transaction does not exist.");
    }
    const { from: to, to: from, status, amount } = ifTransactionExists;
    // const ifReceiverExists = await User.findOne({phoneNo:to})
    // await anyValidator(ifReceiverExists);
    // const ifSenderExists = await User.findOne({phoneNo:from})
    // await anyValidator(ifSenderExists);

    if (
      status === ITransactionStatus.PENDING ||
      status === ITransactionStatus.REFUNDED ||
      status === ITransactionStatus.FAILED
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Your operation is not correct."
      );
    }
    const senderWallet = await Wallet.findOne({ walletId: from });
    if (!senderWallet) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "sender wallet does not exist."
      );
    }
    if (amount > senderWallet.balance) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Sender do not have sufficient balance."
      );
    }
    const receiverWallet = await Wallet.findOne({ walletId: to });
    if (!receiverWallet) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Receiver wallet does not exist."
      );
    }

    receiverWallet.balance = receiverWallet.balance + amount;
    senderWallet.balance = senderWallet.balance - amount;
    ifTransactionExists.status = ITransactionStatus.REFUNDED;

    ifTransactionExists.save({ session });
    await senderWallet.save({ session });
    await receiverWallet.save({ session });
    await session.commitTransaction();
    session.endSession();
    return ifTransactionExists.toObject();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TransactionServices = {
  getSingleTransaction,
  getAllTransactions,
  addMoney,
  withdrawMoney,
  cashIn,
  sendMoney,
  addMoneyConfirm,
  refund,
};
