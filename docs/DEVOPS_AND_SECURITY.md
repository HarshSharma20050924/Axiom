# AXIOM: DevOps & Security

## Infrastructure

### Environment Separation
*   **Development:** Localhost, mocked payments, test database.
*   **Staging:** Exact replica of Prod, connected to Sanity Staging dataset.
*   **Production:** The live environment.

### Hosting Strategy
*   **Frontend:** **Vercel Pro/Enterprise**.
    *   Why: Edge Functions for personalization, Image Optimization, best-in-class Next.js support.
*   **Backend (Medusa):** **Railway** or **AWS ECS**.
    *   Why: Persistent long-running Node.js processes required for Medusa.
*   **Database:** **Neon** (Serverless Postgres) or **AWS RDS**.
*   **Redis:** **Upstash** (Serverless Redis).

## CI/CD Pipeline (GitHub Actions)

### Workflow: `pull_request`
1.  **Lint:** Eslint + Prettier check.
2.  **Type Check:** `tsc --noEmit`.
3.  **Test:** Jest (Unit) + Playwright (E2E for critical flows like Checkout).
4.  **Preview:** Vercel deploys a preview URL.

### Workflow: `push (main)`
1.  **Build:** Production build validation.
2.  **Deploy:** Promote to Production.
3.  **Database:** Run migrations (`medusa migrations run`).

## Security Protocols

### 1. Secrets Management
*   **Do not** commit `.env` files.
*   Use Vercel Environment Variables for Frontend.
*   Use Railway/AWS Secrets Manager for Backend.

### 2. Content Security Policy (CSP)
Strict CSP headers to prevent XSS.
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' https://va.vercel-scripts.com; connect-src 'self' https://api.axiom.com; img-src 'self' blob: data: https://cdn.sanity.io;
```

### 3. API Hardening
*   **Rate Limiting:** Limit IP addresses to 100 requests/minute to prevent DDoS.
*   **CORS:** Only allow requests from `https://axiom.com`.
*   **Input Validation:** Use **Zod** schema validation on all API inputs to prevent Injection attacks.

## Monitoring & Observability

### 1. Error Tracking
*   **Sentry:** Integrated into both Frontend and Backend to capture crash reports and stack traces.

### 2. Logs
*   **Datadog:** Aggregated logs from Medusa backend and PostgreSQL.

### 3. Analytics
*   **Business:** Medusa Admin Analytics (Revenue, AOV).
*   **Behavioral:** PostHog (Click heatmaps, session recording).
*   **Performance:** Vercel Speed Insights (LCP, FID, CLS).