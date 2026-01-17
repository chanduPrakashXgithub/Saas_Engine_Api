# SaaS Engine API - Testing Reference

> **Personal Testing Doc** - For your reference to test all endpoints

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed plans (optional)
node prisma/seed.js

# Start server
npm run dev
```

Server runs on: `http://localhost:4000`

---

## Bugs Fixed (Jan 18, 2026)

| File | Issue | Fix |
|------|-------|-----|
| `src/utils/jwt.js` | Missing `return` in `sign_token` and `verfy_token` | Added return statements |
| `src/utils/jwt.js` | Offensive default secret | Changed to `"change-me-in-production"` |
| `src/middleware/audit.middleware.js` | Typo `createAuduitLog`, param shadowing `resource` | Fixed typo, renamed to `resourceType` |
| `src/middleware/error.middleware.js` | `json.stringify` should be `JSON.stringify` | Fixed case |
| `src/modules/user/user.service.js` | Password stored in plain text | Added bcrypt hashing |
| `src/modules/user/user.service.js` | Missing `resetPassword` function | Added implementation |
| `src/modules/tenant/tenant.routes.js` | Duplicate POST `/` route | Removed duplicate |

---

## API Endpoints - Postman Collection

### Base URL
```
http://localhost:4000/api
```

---

### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{"status":"OK"}
```

---

### 2. Tenants

#### Create Tenant
```
POST /api/tenants
Content-Type: application/json

{
  "name": "My Company"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "My Company",
    "status": "ACTIVE",
    "planId": null,
    "createdAt": "2026-01-17T19:03:25.543Z"
  }
}
```

#### List All Tenants
```
GET /api/tenants
```

#### Get Current Tenant (requires x-tenant-id header)
```
GET /api/tenants/me
Headers:
  x-tenant-id: <tenant-uuid>
```

---

### 3. Users

> **All user endpoints require header:** `x-tenant-id: <tenant-uuid>`

#### Create User
```
POST /api/users
Headers:
  x-tenant-id: <tenant-uuid>
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "TENANT_ADMIN"
}
```
**Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `TENANT_USER`

#### List Users
```
GET /api/users
Headers:
  x-tenant-id: <tenant-uuid>
```
**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "TENANT_ADMIN",
      "createdAt": "2026-01-17T19:03:40.467Z"
    }
  ]
}
```

#### Reset Password
```
PATCH /api/users/:userId/reset-password
Headers:
  x-tenant-id: <tenant-uuid>
Content-Type: application/json

{
  "newPassword": "NewSecurePass456!"
}
```

---

### 4. Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. API Keys

#### Bootstrap - Create Your FIRST API Key (No existing API key needed)
```
POST /api/api-keys/bootstrap
Headers:
  Authorization: Bearer <jwt-token>
  x-tenant-id: <tenant-uuid>
Content-Type: application/json

{
  "name": "My First Key"
}
```
**Response:**
```json
{
  "id": "uuid",
  "name": "My First Key",
  "apiKey": "f082b22d2157ca07b555b614e76df65c..."  // ⚠️ SAVE THIS! Only shown once!
}
```

#### Create Additional API Keys (Requires existing API key)
```
POST /api/api-keys
Headers:
  Authorization: ApiKey <your-api-key>
  X-Auth-Token: <jwt-token>
Content-Type: application/json

{
  "name": "Production Key"
}
```

#### List API Keys
```
GET /api/api-keys
Headers:
  Authorization: ApiKey <your-api-key>
  X-Auth-Token: <jwt-token>
```
**Response:**
```json
{
  "apiKeys": [
    {
      "id": "uuid",
      "name": "My First Key",
      "keyPrefix": "f082b22d",
      "status": "ACTIVE",
      "createdAt": "2026-01-17T19:33:11.929Z",
      "lastUsedAt": "2026-01-17T19:33:51.051Z"
    }
  ]
}
```

#### Revoke API Key
```
DELETE /api/api-keys/:id
Headers:
  Authorization: ApiKey <your-api-key>
  X-Auth-Token: <jwt-token>
```

---

## Testing Flow (Step by Step)

### Step 1: Create a Tenant
```powershell
$body = '{"name": "Test Company"}'
Invoke-WebRequest -Uri "http://localhost:4000/api/tenants" -Method POST -Body $body -ContentType "application/json"
```
**Save the `id` from response → `TENANT_ID`**

### Step 2: Create a User
```powershell
$headers = @{"x-tenant-id"="YOUR_TENANT_ID"}
$body = '{"email": "admin@test.com", "password": "Test123!", "role": "TENANT_ADMIN"}'
Invoke-WebRequest -Uri "http://localhost:4000/api/users" -Method POST -Body $body -Headers $headers -ContentType "application/json"
```
**Save the `id` from response → `USER_ID`**

### Step 3: Login
```powershell
$body = '{"email": "admin@test.com", "password": "Test123!"}'
Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```
**Save `token` from response → `JWT_TOKEN`**

### Step 4: List Users
```powershell
$headers = @{"x-tenant-id"="YOUR_TENANT_ID"}
Invoke-WebRequest -Uri "http://localhost:4000/api/users" -Method GET -Headers $headers
```

### Step 5: Reset Password
```powershell
$headers = @{"x-tenant-id"="YOUR_TENANT_ID"}
$body = '{"newPassword": "NewPass456!"}'
Invoke-WebRequest -Uri "http://localhost:4000/api/users/YOUR_USER_ID/reset-password" -Method PATCH -Body $body -Headers $headers -ContentType "application/json"
```

### Step 6: Verify Login with New Password
```powershell
$body = '{"email": "admin@test.com", "password": "NewPass456!"}'
Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### Step 7: Create Your First API Key (Bootstrap)
```powershell
$headers = @{"Authorization"="Bearer YOUR_JWT_TOKEN"; "x-tenant-id"="YOUR_TENANT_ID"}
$body = '{"name": "My First Key"}'
Invoke-WebRequest -Uri "http://localhost:4000/api/api-keys/bootstrap" -Method POST -Body $body -Headers $headers -ContentType "application/json"
```
**⚠️ SAVE the `apiKey` from response → `API_KEY` (shown only once!)**

### Step 8: Use API Key to List Keys
```powershell
$headers = @{"Authorization"="ApiKey YOUR_API_KEY"; "X-Auth-Token"="YOUR_JWT_TOKEN"}
Invoke-WebRequest -Uri "http://localhost:4000/api/api-keys" -Method GET -Headers $headers
```

---

## Database Models

| Model | Description |
|-------|-------------|
| `Tenant` | Multi-tenant organization |
| `User` | Users belonging to a tenant |
| `ApiKey` | API keys for tenant access |
| `Plan` | Subscription plans (FREE, PRO) |
| `UsageRecord` | API usage metering per tenant/month |
| `BillingEvent` | Billing events (invoices, charges) |
| `AuditLog` | Action audit trail |

---

## Project Structure

```
src/
├── app.js              # Express app setup
├── server.js           # Server entry point
├── config/
│   ├── env.js          # Environment variables
│   └── prisma.js       # Prisma client (with pg adapter)
├── middleware/
│   ├── apiKey.middleware.js      # API key validation
│   ├── auth.middleware.js        # JWT + role auth
│   ├── audit.middleware.js       # Audit logging
│   ├── quota.middleware.js       # Usage quota check
│   ├── tenantResolver.middleware.js  # x-tenant-id resolution
│   ├── error.middleware.js       # Global error handler
│   └── requestLogger.middleware.js   # Request logging
├── modules/
│   ├── apikey/         # API key CRUD
│   ├── auth/           # Login
│   ├── tenant/         # Tenant CRUD
│   └── user/           # User CRUD
├── services/
│   ├── audit.service.js    # Audit log creation
│   ├── metering.service.js # Usage tracking
│   └── quota.service.js    # Quota enforcement
├── utils/
│   ├── apiKey.js       # API key generation
│   ├── asyncHandler.js # Async error wrapper
│   ├── billingPeriod.js # Current period (YYYY-MM)
│   └── jwt.js          # JWT sign/verify
└── routes/
    └── index.js        # Route aggregator
```

---

## Environment Variables

Create `.env` in root:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/saas_engine
JWT_SECRET=your-secure-secret-here
PORT=4000
NODE_ENV=development
```

---

## Test Results (Jan 18, 2026)

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/health` | GET | ✅ PASS | |
| `/api/tenants` | POST | ✅ PASS | Creates tenant with audit log |
| `/api/tenants` | GET | ✅ PASS | Lists all tenants |
| `/api/tenants/me` | GET | ✅ PASS | Requires x-tenant-id |
| `/api/users` | POST | ✅ PASS | Password hashed correctly |
| `/api/users` | GET | ✅ PASS | Returns users without passwords |
| `/api/users/:id/reset-password` | PATCH | ✅ PASS | |
| `/api/auth/login` | POST | ✅ PASS | Returns JWT token |
| `/api/api-keys` | POST | ✅ PASS | Protected by API key middleware |
| `/api/api-keys/:id` | DELETE | ✅ PASS | Revokes key |

---

## Known Limitations

1. **No registration endpoint** - Users created via admin only
2. **API key routes require existing API key** - Bootstrap endpoint added to solve this
3. **No refresh token** - JWT expires in 1 hour
4. **Audit logs fire on `res.finish`** - May miss some edge cases

---

*Last tested: January 18, 2026*

---

# 🔒 PERSONAL NOTES - REMOVE BEFORE DEPLOYING

## Problems Faced While Building This Project

### 1. **JWT Functions Not Returning Values**
**Problem:** Login was returning `undefined` token instead of actual JWT.
```javascript
// ❌ WRONG - forgot return statement
export const sign_token = (payload) => {
    jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

// ✅ FIXED
export const sign_token = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}
```
**Lesson:** Always check if functions return values, especially with arrow functions.

---

### 2. **Prisma Relations Missing Reverse Field**
**Problem:** `npx prisma migrate dev` failed with validation errors.
```
Error: The relation field `tenant` on model `AuditLog` is missing 
an opposite relation field on the model `Tenant`.
```
**Solution:** Every `@relation` needs a corresponding array field on the other model:
```prisma
// In AuditLog model
tenant Tenant? @relation(fields: [tenantId], references: [id])

// Must add in Tenant model
auditLogs AuditLog[]
```
**Lesson:** Prisma relations are always two-way. If Model A points to Model B, Model B must have an array of Model A.

---

### 3. **Password Stored in Plain Text**
**Problem:** User service was saving raw passwords to database.
```javascript
// ❌ WRONG - security vulnerability!
return prisma.user.create({
    data: { email, password, role, tenantId }
})

// ✅ FIXED
const hashedPassword = await bcrypt.hash(password, 10);
return prisma.user.create({
    data: { email, password: hashedPassword, role, tenantId }
})
```
**Lesson:** NEVER store plain text passwords. Always hash with bcrypt (cost factor 10+).

---

### 4. **Bootstrap Problem (Chicken-and-Egg)**
**Problem:** API key routes required an existing API key to create new ones.
```
POST /api/api-keys → requires Authorization: ApiKey <key>
But how do I get the first key? 🤔
```
**Solution:** Created a separate bootstrap endpoint:
```javascript
// Bootstrap route - uses JWT + x-tenant-id (no API key needed)
router.post("/bootstrap", tenantResolverMiddleware, auth_middlewaare(["TENANT_ADMIN"]), ...)

// Regular routes - require existing API key
router.use(apiKeyMiddleware);
router.post("/", ...)
```
**Lesson:** Think about the initial setup flow. How does a new tenant get started?

---

### 5. **Authorization Header Conflict**
**Problem:** Both API key and JWT auth used the same `Authorization` header.
```
Authorization: ApiKey <key>   ← API key middleware expects this
Authorization: Bearer <jwt>   ← Auth middleware expects this
// Can't have both!
```
**Solution:** Accept JWT from alternative header when API key is present:
```javascript
const authHeader = req.headers.authorization;
const xAuthToken = req.headers["x-auth-token"];

let token = null;
if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
} else if (xAuthToken) {
    token = xAuthToken;  // Fallback for when ApiKey uses Authorization
}
```
**Lesson:** Design authentication to handle multiple auth methods gracefully.

---

### 6. **ESM Module Issues**
**Problem:** `require()` doesn't work with `"type": "module"` in package.json.
```javascript
// ❌ WRONG in ESM
const express = require('express');

// ✅ CORRECT in ESM
import express from 'express';
```
**Lesson:** Stick to one module system. ESM uses `import/export`, CommonJS uses `require/module.exports`.

---

### 7. **Prisma Client Not Updated**
**Problem:** Added new models but `prisma.plan` was `undefined`.
```
TypeError: Cannot read properties of undefined (reading 'createMany')
```
**Solution:** Run `npx prisma generate` after schema changes to regenerate client.
**Lesson:** Schema changes require: `migrate dev` (DB) + `generate` (client code).

---

### 8. **Case Sensitivity Bug**
**Problem:** `json.stringify` instead of `JSON.stringify` in error middleware.
```javascript
// ❌ WRONG - ReferenceError: json is not defined
console.error(json.stringify({ error: err.message }))

// ✅ CORRECT - JSON is a global object
console.error(JSON.stringify({ error: err.message }))
```
**Lesson:** JavaScript is case-sensitive. `JSON` ≠ `json`.

---

### 9. **Parameter Shadowing in Middleware**
**Problem:** Named parameter `resource` shadowed the outer variable in audit middleware.
```javascript
// ❌ WRONG - 'resource' parameter shadows the action resource
export const auditMiddleware = (action, resource) => {
    return async (req, resource, next) => {  // resource is now 'res'!
        resource.on("finish", ...)  // This is res, not the resource string
    }
}

// ✅ FIXED - renamed parameter
export const auditMiddleware = (action, resourceType) => {
    return async (req, res, next) => {
        res.on("finish", async () => {
            await createAuditLog({ resource: resourceType, ... })
        })
    }
}
```
**Lesson:** Be careful with parameter names. Use descriptive names to avoid shadowing.

---

## Interview Questions & Answers

### Architecture & Design

**Q1: What is multi-tenancy and how did you implement it?**
> Multi-tenancy is an architecture where a single application serves multiple customers (tenants) while keeping their data isolated. I implemented it using:
> - **Tenant ID in every table** - Each record has a `tenantId` foreign key
> - **Tenant resolver middleware** - Extracts `x-tenant-id` header and validates tenant exists
> - **Query scoping** - All queries filter by `tenantId` to ensure data isolation
> - **API keys tied to tenants** - Each API key belongs to a specific tenant

**Q2: Why did you use Prisma over raw SQL or other ORMs?**
> - **Type safety** - Auto-generated types catch errors at compile time
> - **Migrations** - Version-controlled schema changes
> - **Relations** - Easy to define and query related data
> - **Database agnostic** - Can switch between PostgreSQL, MySQL, SQLite
> - **Prisma Studio** - GUI for data exploration during development

**Q3: Explain your authentication flow.**
> 1. User sends `email + password` to `/api/auth/login`
> 2. Server finds user, compares bcrypt hash
> 3. If valid, server creates JWT with `{ id, email, role }` signed with secret
> 4. Client stores JWT and sends in `Authorization: Bearer <token>` header
> 5. `auth_middleware` verifies JWT signature and checks role permissions
> 6. JWT expires in 1 hour (stateless, no server-side session)

**Q4: What's the difference between authentication and authorization?**
> - **Authentication** = "Who are you?" → Verifying identity (login, JWT validation)
> - **Authorization** = "What can you do?" → Checking permissions (role-based access)
> ```javascript
> // Authentication - verify token is valid
> const decoded = verfy_token(token);
> 
> // Authorization - check if user has required role
> if (!roles.includes(decoded.role)) {
>     return res.status(403).json({ error: "Forbidden" });
> }
> ```

**Q5: Why hash passwords with bcrypt instead of SHA256?**
> - **bcrypt is slow by design** - Makes brute force attacks impractical
> - **Built-in salt** - Each hash includes random salt, so same password → different hashes
> - **Configurable cost factor** - Can increase rounds as hardware improves
> - SHA256 is fast (bad for passwords) and requires manual salting

---

### Security

**Q6: How do you prevent SQL injection?**
> Prisma uses parameterized queries internally. User input is never concatenated into SQL:
> ```javascript
> // Safe - Prisma escapes the email value
> prisma.user.findUnique({ where: { email: userInput } })
> 
> // vs unsafe raw SQL
> `SELECT * FROM users WHERE email = '${userInput}'`  // ❌ SQL injection risk
> ```

**Q7: How does your API key system work?**
> 1. Generate 32-byte random key: `crypto.randomBytes(32).toString("hex")`
> 2. Store only the SHA256 hash in database (not the raw key)
> 3. Store first 8 chars as prefix for identification
> 4. On request, hash the provided key and compare with stored hash
> 5. If match found and status is ACTIVE, allow request
> ```javascript
> const rawKey = header.replace("ApiKey ", "");
> const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
> const apiKey = await prisma.apiKey.findFirst({
>     where: { keyPrefix: rawKey.slice(0, 8), keyHash: hash, status: "ACTIVE" }
> });
> ```

**Q8: What security headers should you add in production?**
> ```javascript
> // Using helmet middleware
> app.use(helmet());
> 
> // Key headers:
> // X-Content-Type-Options: nosniff
> // X-Frame-Options: DENY
> // Strict-Transport-Security: max-age=31536000
> // Content-Security-Policy: default-src 'self'
> ```

---

### Node.js & Express

**Q9: What is middleware and how does Express use it?**
> Middleware are functions that run between request and response. They have access to `req`, `res`, and `next()`:
> ```javascript
> const middleware = (req, res, next) => {
>     // Do something with request
>     req.customData = "hello";
>     next();  // Pass to next middleware/route
> }
> 
> // Order matters!
> app.use(cors());           // 1st
> app.use(express.json());   // 2nd
> app.use(authMiddleware);   // 3rd
> app.use("/api", routes);   // 4th
> app.use(errorMiddleware);  // Last (catches errors)
> ```

**Q10: Explain the asyncHandler utility.**
> It wraps async route handlers to catch promise rejections and pass them to error middleware:
> ```javascript
> // Without asyncHandler - must try/catch manually
> router.get("/", async (req, res, next) => {
>     try {
>         const data = await fetchData();
>         res.json(data);
>     } catch (err) {
>         next(err);  // Easy to forget!
>     }
> });
> 
> // With asyncHandler - automatic error forwarding
> router.get("/", asyncHandler(async (req, res) => {
>     const data = await fetchData();
>     res.json(data);  // Errors auto-forwarded to error middleware
> }));
> ```

**Q11: What's the difference between `app.use()` and `router.get()`?**
> - `app.use()` - Mounts middleware for ALL HTTP methods on a path
> - `router.get()` - Handles only GET requests on a specific path
> ```javascript
> app.use("/api", router);           // All methods: GET, POST, PUT, DELETE...
> router.get("/users", handler);     // Only GET /api/users
> router.post("/users", handler);    // Only POST /api/users
> ```

---

### Database & Prisma

**Q12: What are database migrations and why use them?**
> Migrations are version-controlled schema changes. Benefits:
> - **Track history** - See what changed and when
> - **Team sync** - Everyone applies same changes
> - **Rollback** - Can undo changes if needed
> - **CI/CD** - Automated deployment of schema changes
> ```bash
> npx prisma migrate dev --name add_users_table  # Create migration
> npx prisma migrate deploy                       # Apply in production
> ```

**Q13: Explain the `@@unique` constraint in Prisma.**
> It creates a composite unique index across multiple columns:
> ```prisma
> model UsageRecord {
>     tenantId  String
>     metric    String
>     period    String
>     
>     @@unique([tenantId, metric, period])
> }
> ```
> This means: One tenant can have only ONE record per metric per period.
> Used for upsert operations (insert or update if exists).

**Q14: What is the N+1 query problem?**
> When fetching a list, then making separate queries for each item's relations:
> ```javascript
> // ❌ N+1 Problem - 1 query for tenants + N queries for users
> const tenants = await prisma.tenant.findMany();
> for (const tenant of tenants) {
>     tenant.users = await prisma.user.findMany({ where: { tenantId: tenant.id } });
> }
> 
> // ✅ Solution - use include/join
> const tenants = await prisma.tenant.findMany({
>     include: { users: true }  // Single query with JOIN
> });
> ```

---

### API Design

**Q15: What are REST API best practices you followed?**
> - **Nouns for resources** - `/users`, `/tenants` (not `/getUsers`)
> - **HTTP methods for actions** - GET (read), POST (create), PATCH (update), DELETE
> - **Plural resource names** - `/users` not `/user`
> - **Proper status codes** - 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
> - **Consistent response format** - `{ success: true, data: {...} }`

**Q16: Why use PATCH instead of PUT for updates?**
> - **PUT** = Replace entire resource (must send all fields)
> - **PATCH** = Partial update (send only changed fields)
> ```javascript
> // PUT /users/123 - must include ALL fields
> { "email": "new@email.com", "role": "ADMIN", "name": "John", ... }
> 
> // PATCH /users/123 - only changed fields
> { "email": "new@email.com" }
> ```

**Q17: How would you implement pagination?**
> ```javascript
> // Query params: ?page=2&limit=10
> router.get("/users", asyncHandler(async (req, res) => {
>     const page = parseInt(req.query.page) || 1;
>     const limit = parseInt(req.query.limit) || 10;
>     const skip = (page - 1) * limit;
>     
>     const [users, total] = await Promise.all([
>         prisma.user.findMany({ skip, take: limit }),
>         prisma.user.count()
>     ]);
>     
>     res.json({
>         data: users,
>         pagination: {
>             page,
>             limit,
>             total,
>             totalPages: Math.ceil(total / limit)
>         }
>     });
> }));
> ```

---

### Error Handling

**Q18: How does your error middleware work?**
> It's the last middleware that catches all errors:
> ```javascript
> // Must have 4 parameters for Express to recognize as error handler
> export const errorMiddleware = (err, req, res, next) => {
>     console.error(JSON.stringify({
>         requestId: req.requestId,
>         error: err.message,
>         stack: err.stack
>     }));
>     
>     res.status(err.status || 500).json({
>         success: false,
>         message: err.message || "Internal Server Error"
>     });
> };
> ```

**Q19: What's the difference between 401 and 403?**
> - **401 Unauthorized** = "I don't know who you are" (not authenticated)
> - **403 Forbidden** = "I know who you are, but you can't do this" (not authorized)
> ```javascript
> if (!token) return res.status(401);        // No token provided
> if (!roles.includes(user.role)) return res.status(403);  // Wrong role
> ```

---

### Testing & Debugging

**Q20: How would you test this API?**
> ```javascript
> // Unit tests (Jest)
> describe("JWT Utils", () => {
>     it("should sign and verify token", () => {
>         const payload = { id: "123", role: "ADMIN" };
>         const token = sign_token(payload);
>         const decoded = verfy_token(token);
>         expect(decoded.id).toBe("123");
>     });
> });
> 
> // Integration tests (Supertest)
> describe("Auth API", () => {
>     it("should login with valid credentials", async () => {
>         const res = await request(app)
>             .post("/api/auth/login")
>             .send({ email: "test@test.com", password: "password" });
>         expect(res.status).toBe(200);
>         expect(res.body.token).toBeDefined();
>     });
> });
> ```

---

### Production Considerations

**Q21: What would you add before deploying to production?**
> 1. **Rate limiting** - Prevent abuse (`express-rate-limit`)
> 2. **Input validation** - Validate request bodies (`joi`, `zod`)
> 3. **HTTPS only** - Redirect HTTP to HTTPS
> 4. **Environment variables** - Never hardcode secrets
> 5. **Logging service** - Centralized logs (Winston, Datadog)
> 6. **Health checks** - `/health` endpoint for load balancers
> 7. **CORS configuration** - Restrict to known origins
> 8. **Database connection pooling** - Reuse connections
> 9. **Graceful shutdown** - Handle SIGTERM properly

**Q22: How would you scale this application?**
> - **Horizontal scaling** - Run multiple instances behind load balancer
> - **Stateless design** - JWT auth means no server-side sessions
> - **Database read replicas** - Scale read operations
> - **Caching** - Redis for frequently accessed data
> - **Queue system** - RabbitMQ/SQS for async tasks (emails, reports)
> - **CDN** - For static assets

---

## Quick Reference - Common Mistakes to Avoid

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Forgetting `return` in arrow functions | Returns `undefined` | Always check return values |
| Plain text passwords | Security breach | Use bcrypt with cost ≥10 |
| Missing Prisma reverse relations | Migration fails | Add array field on related model |
| `json` instead of `JSON` | ReferenceError | JavaScript is case-sensitive |
| Not regenerating Prisma client | `undefined` models | Run `npx prisma generate` |
| Same header for multiple auth types | Auth conflicts | Use separate headers |
| Missing `await` on async calls | Unresolved promises | Always await async functions |
| Not validating user input | Injection attacks | Validate with Joi/Zod |

---

*⚠️ DELETE THIS ENTIRE SECTION BEFORE DEPLOYING TO PRODUCTION*
