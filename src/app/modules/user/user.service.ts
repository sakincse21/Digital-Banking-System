import AppError from "../../errorHelpers/appErrorHandler";
import { IRole, IStatus, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import { envVars } from "../../config/env";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { userSearchableFields } from "./user.constant";
import { QueryBuilder } from "../../utils/queryBuilder";

//anyone can create a user uing his phone, nid, email and other info
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

    const userArray = await User.create([payload], {
      session,
    });

    const user = userArray[0];

    const wallet = await Wallet.create(
      [{ walletId: user.phoneNo, userId: user._id }],
      { session }
    );

    user.walletId = wallet[0]._id;

    await user.save({ session });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user.toObject();

    await session.commitTransaction();
    session.endSession();

    return userData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//any user or agent can update his basic info. and admins can modify the financial info
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    if (
      decodedToken.userId !== userId &&
      decodedToken.role !== IRole.ADMIN &&
      decodedToken.role !== IRole.SUPER_ADMIN
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
    }

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
    }

    if(ifUserExist.role===IRole.SUPER_ADMIN && decodedToken.role !== IRole.SUPER_ADMIN){
      throw new AppError(httpStatus.UNAUTHORIZED,"You are not authorized to update super admin.")
    }

    const user = await User.findByIdAndUpdate(ifUserExist._id, payload, {
      new: true,
      runValidators: true,
      session
    });

    if(payload.phoneNo){
      await Wallet.findByIdAndUpdate(user?.walletId,{walletId: user?.phoneNo},{session})
    }

    if (!user) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User is not updated. Try again."
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user.toObject();

    await session.commitTransaction();
    session.endSession();

    return userData;

    return userData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//admins can mark anyone as deleted
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = user.toObject();

  return userData;
};

//admin can get a single user's info
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password").populate("walletId");

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  return user.toObject();
};

//any user can search anyone
const searchUser = async (phoneNo: string) => {
  const user = await User.findOne({phoneNo}).select({ phoneNo: 1, name: 1, role: 1, _id:0 });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  return user.toObject();
};

//admins can get all users info
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

//anyone can get his own info
const getMe = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("walletId");

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists.");
  }

  return user.toObject();
};

//anyone can get his own info
const updatePassword = async (
  payload: Record<string, string>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await User.findById(decodedToken.userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }
  const { newPassword, oldPassword } = payload;

  const ifOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    ifUserExist.password
  );

  if (!ifOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password does not match.");
  }

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT)
  );

  ifUserExist.password = hashedPassword;

  await ifUserExist.save();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = ifUserExist.toObject();

  return userData;
};

export const UserServices = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUsers,
  getMe,
  deleteUser,
  updatePassword,
  searchUser
};
