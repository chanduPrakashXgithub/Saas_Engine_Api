import { Router } from "express";
import * as tenantController from "./tenant.controller.js";
import { tenantResolverMiddleware } from "../../middleware/tenantResolver.middleware.js";
import { auditMiddleware } from "../../middleware/audit.middleware.js";

const router = Router();

router.post("/", auditMiddleware("CREATE", "TENANT"), tenantController.createTenant);
router.get("/", tenantController.getTenants);
router.get("/me", tenantResolverMiddleware, (req, res) => {
    res.json(req.tenant);
});

export default router;