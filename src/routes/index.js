import { Router } from "express";
import tenantroutes from "../modules/tenant/tenant.routes.js";
import userroutes from "../modules/user/user.routes.js";
const router = Router();
router.get("/health", (req, res) => {
    res.json({ status: "OK" });
});
router.use("/tenants", tenantroutes);

router.use("/users", userroutes);
export default router;