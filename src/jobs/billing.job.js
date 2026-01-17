import { prisma } from "../config/prisma.js";

export const generateInvoices = async () => {
    const tenants = await prisma.tenant.findMany({
        include: { plan: true },
    });

    for (const tenant of tenants) {
        if (!tenant.plan) continue;

        await prisma.billingEvent.create({
            data: {
                tenantId: tenant.id,
                type: "INVOICE_GENERATED",
                amount: tenant.plan.pricePerMonth,
                metadata: {
                    plan: tenant.plan.name,
                },
            },
        });
    }
};
//You can trigger this:

// via cron

// via admin API

// later via a queue(BullMQ)