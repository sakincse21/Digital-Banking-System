import { IWallet } from "./wallet.interface";
import AppError from "../../errorHelpers/appErrorHandler";
import httpStatus from 'http-status';
import { Wallet } from "./wallet.model";
import { JwtPayload } from "jsonwebtoken";
import { IRole } from "../user/user.interface";
import { User } from "../user/user.model";

const updateWallet = async (
  walletId: string,
  payload: Partial<IWallet>
) => {
  const ifUserExist = await Wallet.findById(walletId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  const wallet = await Wallet.findByIdAndUpdate(ifUserExist._id, payload, {
    new: true,
    runValidators: true,
  });

  if (!wallet) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Wallet is not updated. Try again."
    );
  }


  return wallet;
};

const getSingleWallet = async (walletId: string, decodedToken: JwtPayload) => {
    const ifUserExists = await User.findById(decodedToken.userId);
    if(!ifUserExists){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.")
    }
    
    
    if(ifUserExists.role !== IRole.ADMIN && ifUserExists.role!== IRole.SUPER_ADMIN){
        if(ifUserExists.walletId.toString() !== walletId){
            throw new AppError(httpStatus.UNAUTHORIZED, "You do not have permission for this operation.")
        }
    }

  const wallet = await Wallet.findById(walletId).populate("transactionId")
  if (!wallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet does not exist.");
  }

  return wallet;
};

const getAllWallets = async () => {
  const wallets = await Wallet.find({})

  return wallets;
};

export const WalletServices = {
    updateWallet,
    getSingleWallet,
    getAllWallets
}