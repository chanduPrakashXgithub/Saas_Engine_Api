import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import * as controller from "./audit.controller.js";

const router = Router();

// Tenant admin
router.get(
    "/tenant",
    authMiddleware(["TENANT_ADMIN"]),
    controller.getTenantLogs
);

// Super admin
router.get(
    "/all",
    authMiddleware(["SUPER_ADMIN"]),
    controller.getAllLogs
);
router.use("/audit-logs", auditRoutes);


export default router;
