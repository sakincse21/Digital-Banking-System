"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = ["PORT", "MONGODB_URL", "NODE_ENV", "BCRYPT_SALT", "JWT_SECRET", "JWT_EXPIRE", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_EMAIL"];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        MONGODB_URL: process.env.MONGODB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT: process.env.BCRYPT_SALT,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE: process.env.JWT_EXPIRE,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    };
};
exports.envVars = loadEnvVariables();
