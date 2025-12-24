import {prisma} from '../config/prisma.js';
export const tenantResolverMiddleware = async(req,res,next)=>{
    const tenantId = req.header("x-tenant-id");
    if(!tenantId){
        return res.status(400).json({
            error: "Tenant ID header (x-tenantid) is required"
        })
    }
    const tenant = await prisma.tenant.findUnique({
        where:{id:tenantId},
    })
    if(!tenant){
        return res.status(404).json({
            error: "Tenant not found"
        })

    }
    if(tenant.status !== "ACTIVE"){
        return res.status(403).json({
            error: "Tenant is not active"
        })
    }
    req.tenant = tenant;
    req.tenantId = tenantId;
    next();
}