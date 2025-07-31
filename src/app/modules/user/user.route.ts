import { Router } from "express";
import { UserControllers } from "./user.controller";
import { authCheck } from "../../middlewares/authCheck";
import { IRole } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

/**Agent Section
 * create by anyone
 * update normal info like user
 * update agent info by admin
 * delete by admin
 */
// router.post('/agent', UserControllers.createAgent)
// router.patch('/agent/:id', UserControllers.updateAgent)
// router.delete('/agent/:id', UserControllers.deleteUser)

// User Section
router.get('/', authCheck(IRole.ADMIN, IRole.SUPER_ADMIN) , UserControllers.getAllUsers) //by admin
router.post('/create',validateRequest(createUserZodSchema), UserControllers.createUser)
router.get('/me', authCheck(...Object.values(IRole)),UserControllers.getMe) //by anyone
router.patch('/:id',authCheck(IRole.ADMIN, IRole.USER), validateRequest(updateUserZodSchema), UserControllers.updateUser) //not sure
router.get('/:id', authCheck(IRole.ADMIN) ,UserControllers.getSingleUser) //by admin
router.delete('/:id', authCheck(IRole.ADMIN), UserControllers.deleteUser)



export const UserRouter = router