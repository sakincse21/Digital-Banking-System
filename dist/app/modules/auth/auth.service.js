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
exports.AuthServices = void 0;
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const user_interface_1 = require("../user/user.interface");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExists = yield user_model_1.User.findOne({ email: payload.email });
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist. Register first.");
    }
    if (ifUserExists.status === user_interface_1.IStatus.BLOCKED) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User is blocked.");
    }
    if (ifUserExists.status === user_interface_1.IStatus.SUSPENDED) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User is suspended.");
    }
    if (ifUserExists.status === user_interface_1.IStatus.DELETE) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User is deleted.");
    }
    if (ifUserExists.isVerified === false) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User is not verified yet.");
    }
    const passComparison = yield bcryptjs_1.default.compare(payload.password, ifUserExists.password);
    if (!passComparison) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Password does not match.");
    }
    const jwtPayload = {
        userId: ifUserExists._id,
        role: ifUserExists.role,
        email: ifUserExists.email,
        walletId: ifUserExists.walletId
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = ifUserExists.toObject(), { password } = _a, user = __rest(_a, ["password"]);
    return {
        accessToken,
        user
    };
});
exports.AuthServices = {
    login
};
