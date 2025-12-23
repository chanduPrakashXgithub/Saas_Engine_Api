import { Router } from "express";
import tenantroutes from "../modules/tenant/tenant.routes.js";
const router = Router();
router.get("/health", (req, res) => {
    res.json({ status: "OK" });
});
router.use("/tenants", tenantroutes);
export default router;