import { prisma } from "../../config/prisma.js";
import { generateApiKey } from "../../utils/apiKey.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createApiKey = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { rawKey, hash, prefix } = generateApiKey();

    // tenantId comes from apiKeyMiddleware OR tenantResolverMiddleware
    const tenantId = req.tenantId || req.user?.tenantId;

    if (!tenantId) {
        return res.status(400).json({ error: "Tenant ID required" });
    }

    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            tenantId,
            keyHash: hash,
            keyPrefix: prefix,
        },
    });

    res.status(201).json({
        id: apiKey.id,
        name: apiKey.name,
        apiKey: rawKey, // ⚠️ Shown ONLY ONCE - save it!
    });
});

export const listApiKeys = asyncHandler(async (req, res) => {
    const tenantId = req.tenantId || req.user?.tenantId;

    const apiKeys = await prisma.apiKey.findMany({
        where: { tenantId },
        select: {
            id: true,
            name: true,
            keyPrefix: true,
            status: true,
            createdAt: true,
            lastUsedAt: true,
        },
    });

    res.json({ apiKeys });
});

export const revokeApiKey = asyncHandler(async (req, res) => {
    const tenantId = req.tenantId || req.user?.tenantId;

    await prisma.apiKey.update({
        where: { id: req.params.id, tenantId },
        data: { status: "REVOKED" },
    });

    res.status(204).send();
});
