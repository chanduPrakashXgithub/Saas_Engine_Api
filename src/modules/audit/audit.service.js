import { prisma } from "../../config/prisma.js";

export const getTenantAuditLogs = async (tenantId) => {
    return prisma.auditLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
};

export const getAllAuditLogs = async () => {
    return prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
    });
};
