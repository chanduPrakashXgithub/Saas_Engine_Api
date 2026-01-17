import crypto from "crypto";
import { prisma } from "../config/prisma.js";

export const apiKeyMiddleware = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("ApiKey ")) {
        return res.status(401).json({ error: "API key required" });
    }

    const rawKey = header.replace("ApiKey ", "");
    const prefix = rawKey.slice(0, 8);
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            keyPrefix: prefix,
            keyHash: hash,
            status: "ACTIVE",
        },
        include: { tenant: true },
    });

    if (!apiKey) {
        return res.status(401).json({ error: "Invalid API key" });
    }

    req.tenantId = apiKey.tenantId;
    req.apiKeyId = apiKey.id;

    await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
    });

    next();
};
