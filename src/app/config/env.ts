import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  PORT: string;
  MONGODB_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PHONENO: string;
  SUPER_ADMIN_NIDNO: string;
  SUPER_ADMIN_NAME: string;

}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "MONGODB_URL", "NODE_ENV", "BCRYPT_SALT", "JWT_SECRET", "JWT_EXPIRE", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_EMAIL","SUPER_ADMIN_NAME","SUPER_ADMIN_PHONENO","SUPER_ADMIN_NIDNO"];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MONGODB_URL: process.env.MONGODB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRE: process.env.JWT_EXPIRE as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME as string,
    SUPER_ADMIN_NIDNO: process.env.SUPER_ADMIN_NIDNO as string,
    SUPER_ADMIN_PHONENO: process.env.SUPER_ADMIN_PHONENO as string
  };
};

export const envVars = loadEnvVariables();
