import { verfy_token } from "../utils/jwt.js";

export const auth_middlewaare = (roles = []) => {
    return (req, res, next) => {
        // Check for JWT in multiple places:
        // 1. Authorization: Bearer <token>
        // 2. X-Auth-Token: <token> (when Authorization is used for API key)
        const authHeader = req.headers.authorization;
        const xAuthToken = req.headers["x-auth-token"];

        let token = null;

        if (authHeader?.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (xAuthToken) {
            token = xAuthToken;
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const decoded = verfy_token(token);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }
            next();
        } catch {
            return res.status(401).json({ error: "Invalid token" });
        }
    };
};