"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const env_1 = require("../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../wallet/wallet.model");
const user_constant_1 = require("./user.constant");
const queryBuilder_1 = require("../../utils/queryBuilder");
//anyone can create a user uing his phone, nid, email and other info
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
        if (isUserExist) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User already exists.");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT));
        payload.password = hashedPassword;
        const userArray = yield user_model_1.User.create([payload], {
            session,
        });
        const user = userArray[0];
        const wallet = yield wallet_model_1.Wallet.create([{ walletId: user.phoneNo, userId: user._id }], { session });
        user.walletId = wallet[0]._id;
        yield user.save({ session });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user.toObject(), { password } = _a, userData = __rest(_a, ["password"]);
        yield session.commitTransaction();
        session.endSession();
        return userData;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
//any user or agent can update his basic info. and admins can modify the financial info
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        if (decodedToken.userId !== userId &&
            decodedToken.role !== user_interface_1.IRole.ADMIN &&
            decodedToken.role !== user_interface_1.IRole.SUPER_ADMIN) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
        }
        const ifUserExist = yield user_model_1.User.findById(userId);
        if (!ifUserExist) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
        }
        if (ifUserExist.role === user_interface_1.IRole.SUPER_ADMIN && decodedToken.role !== user_interface_1.IRole.SUPER_ADMIN) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to update super admin.");
        }
        const user = yield user_model_1.User.findByIdAndUpdate(ifUserExist._id, payload, {
            new: true,
            runValidators: true,
            session
        });
        if (payload.phoneNo) {
            yield wallet_model_1.Wallet.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.walletId, { walletId: user === null || user === void 0 ? void 0 : user.phoneNo }, { session });
        }
        if (!user) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User is not updated. Try again.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user.toObject(), { password } = _a, userData = __rest(_a, ["password"]);
        yield session.commitTransaction();
        session.endSession();
        return userData;
        return userData;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
//admins can mark anyone as deleted
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    const user = yield user_model_1.User.findByIdAndUpdate(ifUserExist._id, { status: user_interface_1.IStatus.DELETE }, { new: true, runValidators: true });
    if (!user) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User is not updated. Try again.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = user.toObject(), { password } = _a, userData = __rest(_a, ["password"]);
    return userData;
});
//admin can get a single user's info
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password").populate("walletId");
    if (!user) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    return user.toObject();
});
//any user can search anyone
const searchUser = (phoneNo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ phoneNo }).select({ phoneNo: 1, name: 1, role: 1, _id: 0 });
    if (!user) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    return user.toObject();
});
//admins can get all users info
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(user_constant_1.userSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
//anyone can get his own info
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId)
        .select("-password")
        .populate("walletId");
    if (!user) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exists.");
    }
    return user.toObject();
});
//anyone can get his own info
const updatePassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!ifUserExist) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    const { newPassword, oldPassword } = payload;
    const ifOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, ifUserExist.password);
    if (!ifOldPasswordMatch) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Old password does not match.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT));
    ifUserExist.password = hashedPassword;
    yield ifUserExist.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = ifUserExist.toObject(), { password } = _a, userData = __rest(_a, ["password"]);
    return userData;
});
exports.UserServices = {
    createUser,
    updateUser,
    getSingleUser,
    getAllUsers,
    getMe,
    deleteUser,
    updatePassword,
    searchUser
};
