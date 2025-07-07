import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  PORT: string;
  MONGODB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "MONGODB_URL", "NODE_ENV"];
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
  };
};

export const envVars = loadEnvVariables();
