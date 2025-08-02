"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateWalletZodSchema = zod_1.default.object({
    balance: zod_1.default.number({ invalid_type_error: "Balance must be a number." }).optional(),
    walletId: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }).optional(),
});
