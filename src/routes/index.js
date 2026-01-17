import { Router } from "express";
import tenantroutes from "../modules/tenant/tenant.routes.js";
import userroutes from "../modules/user/user.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import apiKeyRoutes from "../modules/apikey/apikey.routes.js";
const router = Router();
router.get("/health", (req, res) => {
    res.json({ status: "OK" });
});
router.use("/auth", authRoutes);
router.use("/tenants", tenantroutes);

router.use("/users", userroutes);
router.use("/api-keys", apiKeyRoutes);
export default router;