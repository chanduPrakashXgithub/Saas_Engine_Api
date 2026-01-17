import { Router } from "express";
import { auth_middlewaare } from "../../middleware/auth.middleware.js";
import * as controller from "./apikey.controller.js";
import { apiKeyMiddleware } from "../middleware/apiKey.middleware.js";
import { quotaMiddleware } from "../middleware/quota.middleware.js";
import { incrementUsage } from "../services/metering.service.js";

const router = Router();
router.use(apiKeyMiddleware, quotaMiddleware);

router.use(async (req, res, next) => {
    await incrementUsage(req.tenantId, "api_requests", 1);
    next();
});

router.use(auth_middlewaare(["TENANT_ADMIN"]));

router.post("/", controller.createApiKey);
router.delete("/:id", controller.revokeApiKey);
router.post(
    "/",
    auditMiddleware("CREATE", "API_KEY"),
    controller.createApiKey
);


export default router;
