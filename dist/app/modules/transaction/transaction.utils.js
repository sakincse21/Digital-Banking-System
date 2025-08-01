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
exports.anyValidator = exports.userValidator = exports.agentValidator = void 0;
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const user_interface_1 = require("../user/user.interface");
const http_status_1 = __importDefault(require("http-status"));
const agentValidator = (ifAgentExists) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ifAgentExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Agent does not exist.");
    }
    if (ifAgentExists.role !== user_interface_1.IRole.AGENT) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Request to an agent please.");
    }
    if ((ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists.status) == user_interface_1.IStatus.BLOCKED ||
        (ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists.status) === user_interface_1.IStatus.SUSPENDED ||
        (ifAgentExists === null || ifAgentExists === void 0 ? void 0 : ifAgentExists.status) === user_interface_1.IStatus.DELETE) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Agent account is Blocked/Suspended.");
    }
});
exports.agentValidator = agentValidator;
const userValidator = (ifUserExists) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    if (ifUserExists.role !== user_interface_1.IRole.USER) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Request to an User please.");
    }
    if ((ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.status) == user_interface_1.IStatus.BLOCKED ||
        (ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.status) === user_interface_1.IStatus.SUSPENDED ||
        (ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.status) === user_interface_1.IStatus.DELETE) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User account is Blocked/Suspended.");
    }
});
exports.userValidator = userValidator;
const anyValidator = (ifUserExists) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exist.");
    }
    if ((ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.status) == user_interface_1.IStatus.BLOCKED ||
        (ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.status) === user_interface_1.IStatus.SUSPENDED ||
        (ifUserExists === null || ifUserExists === void 0 ? void 0 : ifUserExists.status) === user_interface_1.IStatus.DELETE) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User account is Blocked/Suspended.");
    }
});
exports.anyValidator = anyValidator;
