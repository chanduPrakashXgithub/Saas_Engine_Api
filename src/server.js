import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, "0.0.0.0", () => {
    console.log(`🚀 SaaS Engine API running on port ${env.port}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
