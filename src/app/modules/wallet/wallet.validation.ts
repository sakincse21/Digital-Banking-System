import z from "zod";

export const updateWalletZodSchema = z.object({
    balance: z.number({invalid_type_error: "Balance must be a number."}).optional(),
    walletId: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:01\d{9})$/, {
          message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
        }).optional(),
})