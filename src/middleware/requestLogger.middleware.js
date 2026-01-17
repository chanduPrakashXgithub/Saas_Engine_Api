import crypto from "crypto";

export const requestLogger = (req, res, next) => {
    req.requestId = crypto.randomUUID();
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        console.log(
            JSON.stringify({
                requestId: req.requestId,
                method: req.method,
                path: req.originalUrl,
                status: res.statusCode,
                durationMs: duration,
                tenantId: req.tenantId,
            })
        );
    });

    next();
};
