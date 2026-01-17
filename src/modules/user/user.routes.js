import { Router } from "express";
import * as userController from "./user.controller.js";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver.middleware.js";
import { auditMiddleware } from "../../middleware/audit.middleware.js";

const router = Router();

router.use(tenantResolverMiddleware);
router.post("/", auditMiddleware("CREATE", "USER"), userController.createUser);
router.get("/", userController.listUsers);
router.patch("/:userId/reset-password", userController.resetPassword);

export default router;
