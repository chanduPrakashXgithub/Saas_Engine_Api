import { Router } from "express";
import * as tenantController from "./tenant.controller.js";

const router = Router();
router.post("/", tenantController.createTenant);
router.get("/", tenantController.getTenants);

export default router;