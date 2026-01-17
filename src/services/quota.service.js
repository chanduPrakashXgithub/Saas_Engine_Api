import { prisma } from "../config/prisma.js";
import { getUsage } from "./metering.service.js";

export const checkApiQuota = async (tenantId) => {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { plan: true },
    });

    if (!tenant || !tenant.plan) return;

    const usage = await getUsage(tenantId, "api_requests");
    const used = usage?.value || 0;

    if (used >= tenant.plan.maxApiRequestsPerMonth) {
        throw {
            status: 429,
            message: "API quota exceeded for this month",
        };
    }
};
