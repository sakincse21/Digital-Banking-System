"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRouter = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const routes = [
    {
        path: "/user",
        router: user_route_1.UserRouter
    },
    {
        path: "/auth",
        router: auth_route_1.AuthRouter
    },
    {
        path: "/wallet",
        router: wallet_route_1.WalletRouter
    },
    {
        path: "/transaction",
        router: transaction_route_1.TransactionRouter
    },
];
const router = (0, express_1.Router)();
routes.forEach((route) => {
    router.use(route.path, route.router);
});
exports.AppRouter = router;
