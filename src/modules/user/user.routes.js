import { Router } from "express";
import * as userController from "./user.controller.js";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver.middleware.js";

const router = Router();

router.use(tenantResolverMiddleware);
router.post("/", userController.createUser);
router.get("/", userController.listUsers);

export default router;
