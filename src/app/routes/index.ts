import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";

const routes= [
    {
        path: "/user",
        router: UserRouter
    },
    {
        path: "/auth",
        router: AuthRouter
    },
]

const router = Router();

routes.forEach((route) => {
    router.use(route.path, route.router)
})
export const AppRouter = router;