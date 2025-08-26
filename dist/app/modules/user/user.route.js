"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const authCheck_1 = require("../../middlewares/authCheck");
const user_interface_1 = require("./user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
/**
 * create by anyone
 * update normal info from user
 * update role/status/verification info by admin
 * delete by admin
 */
router.patch('/admin/:id', (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(user_validation_1.updateAdminZodSchema), user_controller_1.UserControllers.updateUser);
router.get('/all-users', (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsers); //by admin
router.post('/create', (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
router.get('/me', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), user_controller_1.UserControllers.getMe); //by anyone
router.patch('/update-password', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), (0, validateRequest_1.validateRequest)(user_validation_1.updatePasswordZodSchema), user_controller_1.UserControllers.updatePassword); //by anyone
router.patch('/:id', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), user_controller_1.UserControllers.updateUser); //any user
router.get('/search/:phoneNo', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), user_controller_1.UserControllers.searchUser); //by any type of user
router.get('/:id', (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.SUPER_ADMIN), user_controller_1.UserControllers.getSingleUser); //by admin
router.delete('/:id', (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.SUPER_ADMIN), user_controller_1.UserControllers.deleteUser);
exports.UserRouter = router;
