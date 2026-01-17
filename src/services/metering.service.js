import { prisma } from "../config/prisma.js";
import { currentPeriod } from "../utils/billingPeriod.js";

export const incrementUsage = async (tenantId, metric, value = 1) => {
    const period = currentPeriod();

    await prisma.usageRecord.upsert({
        where: {
            tenantId_metric_period: {
                tenantId,
                metric,
                period,
            },
        },
        update: {
            value: { increment: value },
        },
        create: {
            tenantId,
            metric,
            value,
            period,
        },
    });
};

export const getUsage = async (tenantId, metric) => {
    const period = currentPeriod();

    return prisma.usageRecord.findUnique({
        where: {
            tenantId_metric_period: {
                tenantId,
                metric,
                period,
            },
        },
    });
};
