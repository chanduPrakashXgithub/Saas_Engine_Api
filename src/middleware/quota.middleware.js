import { checkApiQuota } from "../services/quota.service.js";

export const quotaMiddleware = async (req, res, next) => {
    try {
        await checkApiQuota(req.tenantId);
        next();
    } catch (err) {
        next(err);
    }
};
