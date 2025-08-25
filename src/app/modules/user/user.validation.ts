import z from "zod";
import { IRole, IStatus } from "./user.interface";

//Normal User Section
export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." })
    .toLowerCase(),
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  phoneNo: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .regex(/^(?:01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  nidNo: z.union([
    z
      .string({ invalid_type_error: "NID must be string" })
      .length(13, { message: "NID length must be 13 or 17 characters long." }),
    z
      .string({ invalid_type_error: "NID must be string" })
      .length(17, { message: "NID length must be 13 or 17 characters long." }),
  ]),
  role: z
    .enum([IRole.USER, IRole.AGENT], {
      invalid_type_error: "Role must be a string",
    })
});

//anyone basic info update
export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." })
    .optional(),
  // phoneNo: z
  //   .string({ invalid_type_error: "Phone Number must be string" })
  //   .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
  //     message:
  //       "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  //   }).optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
});

//anyone can change his password
export const updatePasswordZodSchema = z.object({
  oldPassword: z
    .string({ invalid_type_error: "oldPassword must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
  newPassword: z
    .string({ invalid_type_error: "oldPassword must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
});

//Admin Access Only Section
export const updateAdminZodSchema = z.object({
  role: z
    .enum([...Object.values(IRole)] as [string, ...string[]], {
      invalid_type_error: "Role must be a string",
    })
    .optional(),
  status: z
    .enum([...Object.values(IStatus)] as [string, ...string[]], {
      invalid_type_error: "Status must be a string",
    })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be a boolean" })
    .optional(),
  phoneNo: z
    .string({ invalid_type_error: "Phone Number must be string" })
    .regex(/^(?:01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    })
    .optional(),
  nidNo: z
    .union([
      z
        .string({ invalid_type_error: "NID must be string" })
        .length(13, {
          message: "NID length must be 13 or 17 characters long.",
        }),
      z
        .string({ invalid_type_error: "NID must be string" })
        .length(17, {
          message: "NID length must be 13 or 17 characters long.",
        }),
    ])
    .optional(),
});

// export const createAdminZodSchema = z.object({
//   name: z
//     .string({ invalid_type_error: "Name must be string" })
//     .min(2, { message: "Name must be at least 2 characters long." })
//     .max(50, { message: "Name cannot exceed 50 characters." }),
//   email: z
//     .string({ invalid_type_error: "Email must be string" })
//     .email({ message: "Invalid email address format." })
//     .min(5, { message: "Email must be at least 5 characters long." })
//     .max(100, { message: "Email cannot exceed 100 characters." }),
//   password: z
//     .string({ invalid_type_error: "Password must be string" })
//     .min(8, { message: "Password must be at least 8 characters long." })
//     .regex(/^(?=.*[A-Z])/, {
//       message: "Password must contain at least 1 uppercase letter.",
//     })
//     .regex(/^(?=.*[!@#$%^&*])/, {
//       message: "Password must contain at least 1 special character.",
//     })
//     .regex(/^(?=.*\d)/, {
//       message: "Password must contain at least 1 number.",
//     }),
//   phoneNo: z
//     .string({ invalid_type_error: "Phone Number must be string" })
//     .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
//       message:
//         "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
//     }),
//   address: z
//     .string({ invalid_type_error: "Address must be string" })
//     .max(200, { message: "Address cannot exceed 200 characters." })
//     .optional(),
//   nidNo: z.union([
//     z
//       .string({ invalid_type_error: "NID must be string" })
//       .length(13, { message: "NID length must be 13 or 17 characters long." }),
//     z
//       .string({ invalid_type_error: "NID must be string" })
//       .length(17, { message: "NID length must be 13 or 17 characters long." }),
//   ]),
// });
