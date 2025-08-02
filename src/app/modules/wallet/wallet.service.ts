import { IWallet } from "./wallet.interface";
import AppError from "../../errorHelpers/appErrorHandler";
import httpStatus from 'http-status';
import { Wallet } from "./wallet.model";
import { JwtPayload } from "jsonwebtoken";
import { IRole } from "../user/user.interface";
import { User } from "../user/user.model";


//admins can update wallet's walletId(phone) and balance
const updateWallet = async (
  walletId: string,
  payload: Partial<IWallet>
) => {
  const ifWalletExist = await Wallet.findById(walletId);

  if (!ifWalletExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  if(payload.walletId){
    ifWalletExist.walletId=payload.walletId;
  }
  if(payload.balance){
    ifWalletExist.balance=payload.balance;
  }

  await ifWalletExist.save();


  return ifWalletExist.toObject;
};

//anyone can get his wallet info and admins can get anyones wallet info
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

  return wallet.toObject();
};

//anyone can get his wallet info and admins can get anyones wallet info
const getWalletByPhone = async (walletId: string, decodedToken: JwtPayload) => {
    const ifUserExists = await User.findById(decodedToken.userId);
    if(!ifUserExists){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.")
    }
    
    const wallet = await Wallet.findOne({walletId}).populate("transactionId")
    
      if (!wallet) {
        throw new AppError(httpStatus.BAD_REQUEST, "Wallet does not exist.");
      }
    
    if(ifUserExists.role !== IRole.ADMIN && ifUserExists.role!== IRole.SUPER_ADMIN){
        if(ifUserExists.walletId.toString() !== wallet?._id.toString()){
            throw new AppError(httpStatus.UNAUTHORIZED, "You do not have permission for this operation.")
        }
    }

  return wallet.toObject();
};

//admins can get all wallets info
const getAllWallets = async () => {
  const wallets = await Wallet.find({})

  return wallets;
};

export const WalletServices = {
    updateWallet,
    getSingleWallet,
    getAllWallets,
    getWalletByPhone
}