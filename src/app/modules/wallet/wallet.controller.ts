import { catchAsync } from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import httpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";
import { WalletServices } from "./wallet.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const wallet = await WalletServices.updateWallet(walletId,req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet Updated Successfully",
        data: wallet,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const decodedToken = req.user;
    const wallet = await WalletServices.getSingleWallet(walletId, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet Fetched Successfully",
        data: wallet,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWalletByPhone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.phone;
    const decodedToken = req.user;
    const wallet = await WalletServices.getWalletByPhone(walletId, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet Fetched Successfully",
        data: wallet,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await WalletServices.getAllWallets()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Wallets Fetched Successfully",
        data: wallet,
    })
})

export const WalletControllers = {
    updateWallet,
    getWallet,
    getAllWallets,
    getWalletByPhone
}