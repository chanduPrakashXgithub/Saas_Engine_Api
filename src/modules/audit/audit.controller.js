import { asyncHandler } from "../../utils/asyncHandler.js";
import * as service from "./audit.service.js";
export const getTenantLogs = asyncHandler(async(req,res)=>{
    const logs =  await service.getTenantAuditLogs(req.user.tenantId);
    res.status(200).json({
        logs
    })
})
export const getAllLogs = asyncHandler(async (req, res) => {
    const logs = await service.getAllAuditLogs();
    res.json(logs);
});