import z from "zod";
import {  ITransactionType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
  type: z.enum([...Object.values(ITransactionType)] as [string, ...string[]], {
    invalid_type_error: "Type must be a string",
  }),
  to: z
    .string({ invalid_type_error: "Request initiator must be a string." })
    .regex(/^(?:01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }),
  amount: z
    .number({ invalid_type_error: "Amount must be a valid number" })
    .min(5, { message: "Amount cannot be less than 5" }),

});
