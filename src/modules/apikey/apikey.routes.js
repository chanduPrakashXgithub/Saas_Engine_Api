import { Router } from "express";
import { auth_middlewaare } from "../../middleware/auth.middleware.js";
import * as controller from "./apikey.controller.js";
import { apiKeyMiddleware } from "../../middleware/apiKey.middleware.js";
import { quotaMiddleware } from "../../middleware/quota.middleware.js";
import { incrementUsage } from "../../services/metering.service.js";
import { auditMiddleware } from "../../middleware/audit.middleware.js";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver.middleware.js";

const router = Router();

// ============================================
// BOOTSTRAP ROUTE (JWT + x-tenant-id header)
// Use this to create your FIRST API key
// ============================================
router.post(
    "/bootstrap",
    tenantResolverMiddleware,
    auth_middlewaare(["TENANT_ADMIN"]),
    auditMiddleware("CREATE", "API_KEY"),
    controller.createApiKey
);

// ============================================
// STANDARD ROUTES (Requires existing API key)
// ============================================
router.use(apiKeyMiddleware, quotaMiddleware);

router.use(async (req, res, next) => {
    await incrementUsage(req.tenantId, "api_requests", 1);
    next();
});

router.use(auth_middlewaare(["TENANT_ADMIN"]));

router.post("/", auditMiddleware("CREATE", "API_KEY"), controller.createApiKey);
router.delete("/:id", controller.revokeApiKey);
router.get("/", controller.listApiKeys);

export default router;
