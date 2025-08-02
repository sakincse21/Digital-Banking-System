import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IRole, IStatus, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })

        if (isSuperAdminExist) {
            // eslint-disable-next-line no-console
            console.log("Super Admin Already Exists!");
            return;
        }

        // eslint-disable-next-line no-console
        console.log("Trying to create Super Admin...");

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT))

        // const wallet = await Wallet.create({});

        const payload: Partial<IUser> = {
            name: envVars.SUPER_ADMIN_NAME,
            role: IRole.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            phoneNo: envVars.SUPER_ADMIN_PHONENO,
            nidNo: envVars.SUPER_ADMIN_NIDNO,
            status: IStatus.ACTIVE,
            // walletId: wallet?._id
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const superadmin = await User.create(payload)
        // eslint-disable-next-line no-console
        console.log("Super Admin Created Successfuly! \n");
        // console.log(superadmin);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}