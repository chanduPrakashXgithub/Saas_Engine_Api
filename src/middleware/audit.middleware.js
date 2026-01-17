import { createAuditLog } from "../services/audit.service.js";
export const auditMiddleware = ( action,resource)=>{
    return async(req,resource,next)=>{
        resource.on("finish",async()=>{
            try{
                await createAuduitLog({
                    tenantId:req.tenantId || req.user?.tenantId,
                    userId : req.user?.id,
                    action,
                    resource,
                    resourceId:req.params.id || null,
                    method:req.method,
                    path : req.originalUrl,
                    ipAddress:req.ip,
                    userAgent:req.headers["User-Agent"],
                    metadata:{
                        statusCode:resource.statusCode
                    },
                });
            }catch(err){
                console.error("Failed to create audit log:",err);
            }
        });        next();
         
    }
}