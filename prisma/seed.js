import { prisma } from "../src/config/prisma.js";

async function main() {
    await prisma.plan.createMany({
        data: [
            {
                name: "FREE",
                maxApiRequestsPerMonth: 1000,
                pricePerMonth: 0,
            },
            {
                name: "PRO",
                maxApiRequestsPerMonth: 100000,
                pricePerMonth: 1999,
            },
        ],
    });
}

main().finally(() => prisma.$disconnect());
