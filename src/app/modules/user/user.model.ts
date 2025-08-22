import { model, Schema } from "mongoose";
import { IRole, IStatus, IUser } from "./user.interface";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    nidNo: {
        type: String,
        required: true,
        unique: true
    },
    walletId: {
        type: Schema.Types.ObjectId,
        // type: String,
        ref: "Wallet",
        // required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(IRole),
        required: true,
        // default: IRole.USER
    },
    status: {
        type: String,
        enum: Object.values(IStatus),
        required: true,
        default: IStatus.ACTIVE
    },
},{
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>('User',UserSchema)