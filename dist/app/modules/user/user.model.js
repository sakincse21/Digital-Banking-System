"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const UserSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(user_interface_1.IRole),
        required: true,
        // default: IRole.USER
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.IStatus),
        required: true,
        default: user_interface_1.IStatus.ACTIVE
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
