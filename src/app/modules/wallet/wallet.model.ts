import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const WalletSchema = new Schema<IWallet>({
    balance: {
        type: Number,
        min: 0,
        default: 50,
    },
    // transactionId: {
    //     type: [Schema.Types.ObjectId],
    //     ref: 'Transaction'
    // }
})

export const Wallet = model<IWallet>('Wallet', WalletSchema)