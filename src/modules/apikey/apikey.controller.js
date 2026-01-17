import { prisma } from "../../config/prisma.js";
import { generateApiKey } from "../../utils/apiKey.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createApiKey = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { rawKey, hash, prefix } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            tenantId: req.user.tenantId,
            keyHash: hash,
            keyPrefix: prefix,
        },
    });

    res.status(201).json({
        id: apiKey.id,
        name: apiKey.name,
        apiKey: rawKey, // shown ONLY ONCE
    });
});

export const revokeApiKey = asyncHandler(async (req, res) => {
    await prisma.apiKey.update({
        where: { id: req.params.id },
        data: { status: "REVOKED" },
    });

    res.status(204).send();
});
