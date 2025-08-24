import httpStatus from 'http-status'
import { UserServices } from './user.service'
import { Request, Response, NextFunction } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await UserServices.updateUser(userId,req.body, req.user)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Updated Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload =req.body;
    const decodedToken = req.user;
    const user = await UserServices.updatePassword(payload, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Updated Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await UserServices.deleteUser(userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Deleted Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await UserServices.getSingleUser(userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Fetched Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const phoneNo = req.params.phoneNo;
    const user = await UserServices.searchUser(phoneNo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Fetched Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const user = await UserServices.getAllUsers(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users Fetched Successfully",
        data: user,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const user = await UserServices.getMe(userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your Info Fetched Successfully",
        data: user,
    })
})

export const UserControllers = {
    createUser,
    updateUser,
    getSingleUser,
    getAllUsers,
    getMe,
    deleteUser,
    updatePassword,
    searchUser
}