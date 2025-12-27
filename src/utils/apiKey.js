import crypto from "crypto";

export const generateApiKey = () => {
    const rawKey = crypto.randomBytes(32).toString("hex");
    const prefix = rawKey.slice(0, 8);
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");

    return { rawKey, hash, prefix };
};
