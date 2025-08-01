import AppError from "../../errorHelpers/appErrorHandler";
import { IRole, IStatus, IUser } from "../user/user.interface";
import httpStatus from 'http-status';

export const agentValidator = async (ifAgentExists: IUser | null)=>{
    if (!ifAgentExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent does not exist.");
  }
  if (ifAgentExists.role !== IRole.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request to an agent please.");
  }
  if (
    ifAgentExists?.status == IStatus.BLOCKED ||
    ifAgentExists?.status === IStatus.SUSPENDED ||
    ifAgentExists?.status === IStatus.DELETE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Agent account is Blocked/Suspended."
    );
  }
}

export const userValidator = async (ifUserExists: IUser | null)=>{
    if (!ifUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }
  if (ifUserExists.role !== IRole.USER) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request to an User please.");
  }
  if (
    ifUserExists?.status == IStatus.BLOCKED ||
    ifUserExists?.status === IStatus.SUSPENDED ||
    ifUserExists?.status === IStatus.DELETE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User account is Blocked/Suspended."
    );
  }
}

export const anyValidator = async (ifUserExists: IUser | null)=>{
    if (!ifUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
  }
  if (
    ifUserExists?.status == IStatus.BLOCKED ||
    ifUserExists?.status === IStatus.SUSPENDED ||
    ifUserExists?.status === IStatus.DELETE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User account is Blocked/Suspended."
    );
  }
}