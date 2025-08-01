import { Router } from "express";
import { UserControllers } from "./user.controller";
import { authCheck } from "../../middlewares/authCheck";
import { IRole } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateAdminZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

/**
 * create by anyone
 * update normal info from user
 * update role/status/verification info by admin
 * delete by admin
 */
router.patch('/admin/:id', authCheck(IRole.ADMIN, IRole.SUPER_ADMIN), validateRequest(updateAdminZodSchema), UserControllers.updateUser)
router.get('/', authCheck(IRole.ADMIN, IRole.SUPER_ADMIN) , UserControllers.getAllUsers) //by admin
router.post('/create',validateRequest(createUserZodSchema), UserControllers.createUser)
router.get('/me', authCheck(...Object.values(IRole)),UserControllers.getMe) //by anyone
router.patch('/:id',authCheck(...Object.values(IRole)), validateRequest(updateUserZodSchema), UserControllers.updateUser) //any user
router.get('/:id', authCheck(IRole.ADMIN, IRole.SUPER_ADMIN) ,UserControllers.getSingleUser) //by admin
//delete is not needed. can be done using admin patch.
router.delete('/:id', authCheck(IRole.ADMIN, IRole.SUPER_ADMIN), UserControllers.deleteUser)



export const UserRouter = router