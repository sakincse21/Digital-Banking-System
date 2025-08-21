import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from "express";
import { TransactionServices } from "./transaction.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.id;
    const decodedToken = req.user;
    const transaction = await TransactionServices.getSingleTransaction(transactionId, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Transaction Fetched Successfully",
        data: transaction,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const query = req.query;
    const allTransactions = await TransactionServices.getAllTransactions(decodedToken, query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Transactions Fetched Successfully",
        data: allTransactions,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = await TransactionServices.addMoney(payload,decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Transaction Created Successfully. Wait for agent's approval.",
        data: transaction,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addMoneyConfirm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const transactionId = req.params.id;
    const transaction = await TransactionServices.addMoneyConfirm(transactionId,decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Added money successfully.",
        data: transaction,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = await TransactionServices.withdrawMoney(payload,decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Money withdrawn successfully.",
        data: transaction,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = await TransactionServices.cashIn(payload,decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Money Cashed In successfully.",
        data: transaction,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const payload = req.body;
    const transaction = await TransactionServices.sendMoney(payload,decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Money Sent successfully.",
        data: transaction,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const refund = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.id
    const transaction = await TransactionServices.refund(transactionId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Money Refunded successfully.",
        data: transaction,
    })
})



export const TransactionControllers = {
    getSingleTransaction,
    addMoney,
    getAllTransactions,
    withdrawMoney,
    cashIn,
    sendMoney,
    addMoneyConfirm,
    refund
}