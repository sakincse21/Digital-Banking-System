import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateWalletZodSchema } from "./wallet.validation";
import { authCheck } from "../../middlewares/authCheck";
import { IRole } from "../user/user.interface";

const router = Router()

router.get('/',authCheck(IRole.ADMIN, IRole.SUPER_ADMIN),WalletControllers.getAllWallets)
router.get('/wallet-id/:phone',authCheck(...Object.values(IRole)),WalletControllers.getWalletByPhone)
router.patch('/:id',authCheck(IRole.ADMIN, IRole.SUPER_ADMIN),validateRequest(updateWalletZodSchema),WalletControllers.updateWallet)
router.get('/:id',authCheck(...Object.values(IRole)),WalletControllers.getWallet)

export const WalletRouter = router