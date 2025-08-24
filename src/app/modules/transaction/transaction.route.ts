import { Router } from "express";
import { TransactionControllers } from "./transaction.controller";
import { authCheck } from "../../middlewares/authCheck";
import { IRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTransactionZodSchema } from "./transaction.validation";

const router = Router();

router.get('/',authCheck(...Object.values(IRole)),TransactionControllers.getAllTransactions)
router.post('/add-money',authCheck(IRole.USER),validateRequest(createTransactionZodSchema),TransactionControllers.addMoney)
router.post('/withdraw',authCheck(IRole.USER),validateRequest(createTransactionZodSchema),TransactionControllers.withdrawMoney)
router.post('/cash-in',authCheck(IRole.AGENT),validateRequest(createTransactionZodSchema),TransactionControllers.cashIn)
router.post('/send-money',authCheck(IRole.USER,IRole.AGENT),validateRequest(createTransactionZodSchema),TransactionControllers.sendMoney)
router.get('/summary',authCheck(IRole.AGENT, IRole.USER),TransactionControllers.getSummary);
// router.get('/admin/summary',authCheck(IRole.ADMIN),TransactionControllers.getAdminSummary);
router.post('/refund/:id',authCheck(IRole.ADMIN, IRole.SUPER_ADMIN),TransactionControllers.refund)
router.post('/add-money-confirm/:id',authCheck(IRole.AGENT),TransactionControllers.addMoneyConfirm)
router.get('/:id',authCheck(...Object.values(IRole)),TransactionControllers.getSingleTransaction)

export const TransactionRouter = router