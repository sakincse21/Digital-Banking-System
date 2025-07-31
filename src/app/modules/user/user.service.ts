import AppError from "../../utils/errorHandler";
import { IStatus, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import { envVars } from "../../config/env";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const isUserExist = await User.findOne({ email: payload.email });

    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User already exists.");
    }

    const hashedPassword = await bcryptjs.hash(
      payload.password as string,
      Number(envVars.BCRYPT_SALT)
    );

    payload.password = hashedPassword;

    const wallet = await Wallet.create([{}], { session });

    const user = await User.create([{ ...payload, walletId: wallet[0]._id }], {
      session,
    });

    // Convert to plain object and exclude password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user[0].toObject();

    //now create default wallet
    //use transaction
    await session.commitTransaction(); //transaction
    session.endSession();

    return userData;
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    throw error;
  }
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.userId !== userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  const user = await User.findByIdAndUpdate(ifUserExist._id, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is not updated. Try again."
    );
  }

  // Convert to plain object and exclude password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = user.toObject();

  return userData;
};

const deleteUser = async (userId: string) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  const user = await User.findByIdAndUpdate(
    ifUserExist._id,
    { status: IStatus.DELETE },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is not updated. Try again."
    );
  }

  // Convert to plain object and exclude password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = user.toObject();

  return userData;
};

const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  return user.toObject();
};

const getAllUsers = async () => {
  const users = await User.find().select("-password");

  return users.map(user => user.toObject());
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password").populate("walletId");

  if (!user) {
    return null;
  }

  return user.toObject();
};

export const UserServices = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUsers,
  getMe,
  deleteUser,
};
