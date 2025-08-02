"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const transaction_interface_1 = require("./transaction.interface");
exports.createTransactionZodSchema = zod_1.default.object({
    type: zod_1.default.enum([...Object.values(transaction_interface_1.ITransactionType)], {
        invalid_type_error: "Type must be a string",
    }),
    to: zod_1.default
        .string({ invalid_type_error: "Request initiator must be a string." })
        .regex(/^(?:01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }),
    amount: zod_1.default
        .number({ invalid_type_error: "Amount must be a valid number" })
        .min(5, { message: "Amount cannot be less than 5" }),
});
