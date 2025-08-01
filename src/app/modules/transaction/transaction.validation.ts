import z from "zod";
import {  ITransactionType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
  type: z.enum([...Object.values(ITransactionType)] as [string, ...string[]], {
    invalid_type_error: "Type must be a string",
  }),
//   from: z
//     .string({ invalid_type_error: "Request initiator must be a string." })
//     .regex(/^(?:01\d{9})$/, {
//       message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
//     }),
  to: z
    .string({ invalid_type_error: "Request initiator must be a string." })
    .regex(/^(?:01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }),
  amount: z
    .number({ invalid_type_error: "Amount must be a valid number" })
    .min(0, { message: "Amount must be greater than 0" }),
//   status: z.enum(
//     [...Object.values(ITransactionStatus)] as [string, ...string[]],
//     {
//       invalid_type_error: "Status must be a string",
//     }
//   ),
});
