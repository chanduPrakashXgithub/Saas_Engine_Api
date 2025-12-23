import { asyncHandler } from "../../utils/asyncHandler.js";
import * as tenantService from "./tenant.service.js";
export const createTenant = asyncHandler(async (req, res) => {
    const tenant = await tenantService.createTenant(req.body);
    res.status(201).json({
        success: true,
        data: tenant
    });
});
export const getTenants = asyncHandler(async (req, res) => {
    const tenants = await tenantService.getTenants();
    res.status(200).json({ success: true, data: tenants });
});