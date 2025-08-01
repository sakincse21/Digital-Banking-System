import z from "zod";

export const updateWalletZodSchema = z.object({
    balance: z.number({invalid_type_error: "Balance must be a number."})
})