"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountCheck = void 0;
const appErrorHandler_1 = __importDefault(require("../errorHelpers/appErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const amountCheck = (amount) => {
    if (amount < 50) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Transaction amount cannot be less than 50.");
    }
};
exports.amountCheck = amountCheck;
