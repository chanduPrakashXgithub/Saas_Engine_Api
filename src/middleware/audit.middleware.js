import { createAuditLog } from "../services/audit.service.js";

export const auditMiddleware = (action, resourceType) => {
    return async (req, res, next) => {
        res.on("finish", async () => {
            try {
                await createAuditLog({
                    tenantId: req.tenantId || req.user?.tenantId,
                    userId: req.user?.id,
                    action,
                    resource: resourceType,
                    resourceId: req.params.id || null,
                    method: req.method,
                    path: req.originalUrl,
                    ipAddress: req.ip,
                    userAgent: req.headers["user-agent"],
                    metadata: {
                        statusCode: res.statusCode,
                    },
                });
            } catch (err) {
                console.error("Failed to create audit log:", err);
            }
        });
        next();
    };
};