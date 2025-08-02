import { Types } from "mongoose";

export enum IRole{
    AGENT='AGENT',
    ADMIN='ADMIN',
    USER='USER',
    SUPER_ADMIN="SUPER_ADMIN"
}

export enum IStatus{
    ACTIVE="ACTIVE",
    SUSPENDED="SUSPENDED",
    BLOCKED="BLOCKED",
    DELETE="DELETE",
}

export interface IUser{
    name: string;
    phoneNo: string;
    email: string;
    role: IRole;
    address: string;
    password: string;
    isVerified: boolean;
    nidNo: string;
    status: IStatus;
    // walletId: string;
    walletId: Types.ObjectId;
}