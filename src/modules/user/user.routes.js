import { Router } from "express";
import * as userController from "./user.controller.js";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver.middleware.js";

const router = Router();

router.use(tenantResolverMiddleware);
router.post("/", userController.createUser);
router.get("/", userController.listUsers);
router.patch("/:userId/reset-password", userController.resetPassword);
router.post(
    "/",
    auditMiddleware("CREATE", "USER"),
    userController.createUser
);


export default router;
