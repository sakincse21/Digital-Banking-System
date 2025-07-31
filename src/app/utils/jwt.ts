import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";

export const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRE,
  } as SignOptions);
  return token;
};

export const verifyToken = (token:string) =>{
    const verifiedToken = jwt.verify(token,envVars.JWT_SECRET) as JwtPayload
    return verifiedToken
}
