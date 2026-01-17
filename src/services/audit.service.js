import { prisma } from "../config/prisma.js";

export const createAuditLog = async ({
    tenantId,
    userId,
    action,
    resource,
    resourceId,
    method,
    path,
    ipAddress,
    userAgent,
    metadata,
}) => {
    return prisma.auditLog.create({
        data: {
            tenantId,
            userId,
            action,
            resource,
            resourceId,
            method,
            path,
            ipAddress,
            userAgent,
            metadata,
        },
    });
};
