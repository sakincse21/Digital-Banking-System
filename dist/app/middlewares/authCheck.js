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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const jwt_1 = require("../utils/jwt");
const appErrorHandler_1 = __importDefault(require("../errorHelpers/appErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const authCheck = (...authRoles) => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken || req.headers.authorization;
    // const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "No token provided");
    }
    const verifiedToken = (0, jwt_1.verifyToken)(accessToken);
    if (!verifiedToken) {
        throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "User is not authorized.");
    }
    const ifUserExitst = yield user_model_1.User.findById(verifiedToken.userId);
    if (!authRoles.includes(verifiedToken.role)) {
        throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You do not have permission to access the endpoint.");
    }
    if ((ifUserExitst === null || ifUserExitst === void 0 ? void 0 : ifUserExitst.status) == user_interface_1.IStatus.BLOCKED || (ifUserExitst === null || ifUserExitst === void 0 ? void 0 : ifUserExitst.status) === user_interface_1.IStatus.SUSPENDED || (ifUserExitst === null || ifUserExitst === void 0 ? void 0 : ifUserExitst.status) === user_interface_1.IStatus.DELETE) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Your account is Blocked/Suspended. Contact support team.");
    }
    if (!(ifUserExitst === null || ifUserExitst === void 0 ? void 0 : ifUserExitst.isVerified)) {
        throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not verified yet. Contact support.");
    }
    req.user = verifiedToken;
    next();
}));
exports.authCheck = authCheck;
