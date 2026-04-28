# julianwiley-portal

Personal portal for [julianwiley.com](https://julianwiley.com): a public marketing / blog / projects site **plus** an auth-gated admin dashboard for the `rpi_kubernetes` homelab cluster, all in one Next.js app.

```
                                                                    (Phase 2)
   Visitor ──> Cloudflare Tunnel ──> ingress-nginx ──> portal pod ──> SSG cache
                                                                  └──> NextAuth (/login, /api/auth)
                                                                  └──> auth-gated /app/*
```

## Stack

- **Next.js 15** (App Router) + **React 18** (pinned for `@ant-design/pro-components` compatibility) + **TypeScript strict**
- **Ant Design 5** with `@ant-design/nextjs-registry` for SSR styling
- **@ant-design/pro-components** — `ProLayout`, `ProTable`, `ProForm`, `ProDescriptions`, `StatisticCard`, `PageContainer`
- **@ant-design/plots** for KPI / dashboard charts
- **NextAuth v5 (Auth.js)** — Microsoft Entra ID + Google + dev Credentials providers
- **react-markdown** + `gray-matter` for blog post rendering (custom JSX shortcodes from the Hugo source are flagged but not rendered — see Outstanding TODOs)

## Quick start

Requires Node ≥ 20.

```bash
cp .env.example .env.local
# (edit .env.local — at minimum set AUTH_SECRET; OIDC client IDs are optional)

npm install
npm run dev
# open http://localhost:3000
```

Sign in for the admin section with the dev credentials provider:

- **Username**: `julian`  (override with `DEV_LOGIN_USERNAME`)
- **Password**: `letmein` (override with `DEV_LOGIN_PASSWORD`)

The Microsoft / Google buttons appear automatically once their `AUTH_*` env vars are populated. The dev Credentials provider is only registered when `NODE_ENV !== "production"`.

### Wiring real OAuth providers

#### Google (Cloud Console)

1. https://console.cloud.google.com/apis/credentials → pick or create a project (`julianwileyportal` for this project).
2. **Create credentials → OAuth client ID → Web application**.
3. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` and/or `http://localhost:3001` for local dev (Next picks 3001 if 3000 is taken).
   - `https://julianwiley.com` (and `https://www.julianwiley.com` if used) for prod.
4. Add **Authorized redirect URIs**:
   - `http://localhost:3001/api/auth/callback/google`
   - `https://julianwiley.com/api/auth/callback/google`
5. Copy the client ID + secret into `.env.local`:
   ```env
   AUTH_GOOGLE_ID=<client-id>.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=GOCSPX-...
   ```
6. Restart `npm run dev` (Next does **not** hot-reload `.env.local`).

If a secret was ever pasted into chat / a screenshot / committed to git, **rotate it immediately**: same Credentials page → click the Web client → **Reset Secret** → paste the new value into `.env.local` and the cluster Secret.

#### Microsoft Entra ID (Azure portal)

1. https://portal.azure.com → **Azure Active Directory → App registrations → New registration**.
2. **Redirect URI**: Web type, `https://julianwiley.com/api/auth/callback/microsoft-entra-id` (add the localhost URI for dev).
3. **Certificates & secrets → New client secret** → copy the value.
4. Set in `.env.local`:
   ```env
   AUTH_MICROSOFT_ENTRA_ID_ID=<application (client) id>
   AUTH_MICROSOFT_ENTRA_ID_SECRET=<client secret value>
   AUTH_MICROSOFT_ENTRA_ID_ISSUER=https://login.microsoftonline.com/common/v2.0
   ```
5. Restart the dev server.

## Routes

| Route                 | Visibility | Source                            |
| --------------------- | ---------- | --------------------------------- |
| `/`                   | Public     | `app/(public)/page.tsx`           |
| `/about`              | Public     | `app/(public)/about/page.tsx`     |
| `/projects`           | Public     | `app/(public)/projects/page.tsx`  |
| `/projects/[slug]`    | Public     | `app/(public)/projects/[slug]/`   |
| `/blog`               | Public     | `app/(public)/blog/page.tsx`      |
| `/blog/[slug]`        | Public     | `app/(public)/blog/[slug]/`       |
| `/links`              | Public     | `app/(public)/links/page.tsx`     |
| `/contact`            | Public     | `app/(public)/contact/page.tsx`   |
| `/login`              | Public     | `app/(auth)/login/page.tsx`       |
| `/app`                | Auth       | `app/app/page.tsx`                |
| `/app/projects`       | Auth       | `app/app/projects/page.tsx`       |
| `/app/projects/[slug]`| Auth       | `app/app/projects/[slug]/`        |
| `/app/blog-admin`     | Auth       | `app/app/blog-admin/page.tsx`     |
| `/app/contact-inbox`  | Auth       | `app/app/contact-inbox/page.tsx`  |
| `/api/auth/*`         | Auth API   | `app/api/auth/[...nextauth]/`     |
| `/api/contact`        | Public API | `app/api/contact/route.ts`        |

`middleware.ts` redirects unauthenticated visits to `/app/*` over to `/login?redirect=...`.

## Authoring content

### Blog posts

Each post is `content/posts/<slug>.mdx` with YAML front matter:

```md
---
title: "My new post"
date: 2026-04-20T09:00:00+00:00
description: "Short description for SEO and the blog index."
tags: ["Kubernetes", "Homelab"]
categories: ["RPi Kubernetes"]
---

## Hello

Plain GitHub-flavored markdown is rendered server-side via `react-markdown`.

> Tip: use blockquotes, fenced code blocks, tables, and links — anything supported by GFM.
```

Embedded JSX components (e.g. `<Callout>`, `<Mermaid>`) are not rendered by `react-markdown`. Authors who need them should hand-port the post into a custom React component under `app/(public)/blog/[slug]/` or extend the renderer in a follow-up phase. The migration script wraps any unported Hugo shortcode in a visible warning blockquote so the post still renders.

The MDX components in `components/mdx/` are kept around for the day we wire up `@mdx-js/react` again — they document the intended visual treatment for callouts, project showcases, mermaid, etc.

### Projects

Edit `lib/data/projects.ts`. Each project supports:

- `category`: `"professional"` or `"personal"` (drives the gallery filter)
- `featured`: surfaces on the home page
- `relatedPosts`: blog slugs, used to render the **Related Posts** tab on the public detail page and the **Linked Blog Posts** card on the admin page
- `deployments`: live `{ name, url, namespace?, internal? }` deep-links shown on `/app/projects/[slug]` and the project status card

### About / skills / experience / education / accomplishments / links

All under `lib/data/`. Plain TypeScript modules — no rebuild step needed beyond a normal `next dev` reload.

## Migrating posts from the legacy Hugo site

```bash
node scripts/migrate-posts.mjs
# or:  npm run migrate:posts   (uses tsx for the typed version)
```

The script reads from `../julianwileymac.github.io/content/posts/<slug>/index.md`, strips Hugo `menu:` front-matter blocks, converts known shortcodes (`{{< note >}}`, `{{< callout >}}`, `{{< mermaid >}}`, `{{< embed-pdf >}}`, `{{< toc-inline >}}`) to MDX, and emits each as `content/posts/<slug>.mdx`. Unknown shortcodes are wrapped in a visible `<UnportedShortcode>` warning component so they're easy to find later.

Override the source path with `node scripts/migrate-posts.mjs --source /path/to/hugo/posts`.

## Outstanding migration TODOs

- [ ] Re-enable real MDX (`@mdx-js/react` + `next-mdx-remote` once the React-version-mismatch issue around mixing RSC + MDX in Next.js 15 + React 18 is resolved upstream) so `<Note>`, `<Callout>`, `<Mermaid>`, `<TechStack>`, `<ProjectShowcase>`, and `<CodeTabs>` render in posts/notes/docs. Components are already implemented under `components/mdx/`.
- [ ] Hand-port `{{< project-showcase >}}`, `{{< code-tabs >}}`, and `{{< tech-stack >}}` blocks in `content/posts/project-writeup-template.mdx`, `content/posts/technical-template.mdx`, and `content/docs/guides/{content-authoring,custom-components}.mdx` once MDX is back. The migration script flags every unported shortcode at run time.

## Phase roadmap

### Phase 1 — Foundation (this commit)

- [x] Next.js 15 + AntD + Pro Components scaffold
- [x] Brand tokens, Mulish font, marketing shell + footer
- [x] All YAML data migrated to typed TS modules
- [x] Public pages: landing, about, projects (gallery + detail), blog (index + detail), links, contact
- [x] 56 blog posts migrated to MDX
- [x] NextAuth v5 with Entra + Google + dev Credentials
- [x] Auth-gated `/app/*` admin dashboard with ProLayout, project rooms, blog admin table, contact inbox stub

### Phase 4 — Production go-live (shipped)

- [x] `julianwiley.com` and `www.julianwiley.com` are LIVE behind a Cloudflare Tunnel (tunnel id `0168bb5d-4236-4c8a-a642-ab2d28bca470`, name `julianwiley-portal`)
- [x] DNS migrated from Google Cloud DNS to Cloudflare nameservers (`julissa.ns.cloudflare.com`, `kolton.ns.cloudflare.com`)
- [x] Cloudflared deployed in `edge` namespace, 8 active QUIC connections to Cloudflare BOS/EWR PoPs
- [x] Portal deployed in `web` namespace, image pinned to `ghcr.io/julianwileymac/portal:sha-d2f8c2b`
- [x] Real OIDC: rotated Google client secret pushed to cluster Secret + local `.env.local`; `ADMIN_EMAILS=julian@julianwiley.com` promotes the OIDC user to admin
- [x] Public smoke test: `https://julianwiley.com/api/auth/providers` returns 200 with the Google provider JSON

### Routing-bug postmortem (folded into Phase 4)

- The original `app/app/` folder collided with the App Router root (`app/`), causing Next.js 15.5 to mount `app/app/layout.tsx` as an ancestor layout for *every* public route. Symptom: every URL except `/api/auth/*` returned 307 to `/login?redirect=/app`.
- Fix: wrapped admin in a route group at `app/(admin)/app/`. Route groups are URL-invisible so `/app/*` URLs are unchanged.

### Phase 2 — Kubernetes + Cloudflare Tunnel (shipped, foundation)

- [x] Multi-arch `Dockerfile` (linux/amd64 + linux/arm64) with Next.js standalone output and read-only rootfs runtime
- [x] `.github/workflows/docker.yml` → `buildx` → `ghcr.io/julianwileymac/portal` (tags `latest`, `main`, `sha-<short>`, semver on `v*.*.*` tags)
- [x] Manifests in `rpi_kubernetes/kubernetes/base-services/portal/` (ConfigMap, placeholder Secret, Deployment with 2 replicas + spread constraint, ClusterIP Service, Ingress for `julianwiley.com` and `portal.local`)
- [x] `cloudflared` Deployment + Secret stub + ConfigMap under `rpi_kubernetes/kubernetes/base-services/cloudflared/` routing `julianwiley.com` and `www.julianwiley.com` to `ingress-nginx`
- [x] New `web` and `edge` namespaces added to `rpi_kubernetes/kubernetes/namespaces/namespaces.yaml`
- [x] Both new paths registered in `rpi_kubernetes/kubernetes/kustomization.yaml`
- [ ] One-time bootstrap (run by hand once Cloudflare account access is sorted): `cloudflared tunnel login` → `cloudflared tunnel create julianwiley-portal` → `cloudflared tunnel route dns julianwiley-portal julianwiley.com` → push the credentials JSON into `Secret/cloudflared-credentials`

### Phase 3 — Polish (shipped)

- [x] Role-based access via [`lib/access.ts`](lib/access.ts): typed `Role` (viewer/editor/admin), env-var allow-lists (`ADMIN_EMAILS`, `EDITOR_EMAILS`), sidebar items in `AdminShell` and the blog-admin / contact-inbox pages gate on role
- [x] Live cluster KPIs via [`lib/prometheus.ts`](lib/prometheus.ts) + [`/api/metrics/kpi`](app/api/metrics/kpi/route.ts), polled with SWR every 30 s. Gracefully degrades to a "Prometheus unreachable" notice when `PROMETHEUS_URL` is unset
- [x] G6 request-flow topology on `/app/projects/[slug]` (Browser → Cloudflare Tunnel → ingress-nginx → Service → Pod) — see [`components/admin/ProjectTopology.tsx`](components/admin/ProjectTopology.tsx)
- [x] `content/notes` (10 files) and `content/docs` (9 files) migrated; new public `/notes` + `/docs` routes with sidebar + GFM rendering
- [x] `/api/contact` forwards to a configurable `CONTACT_FORWARD_URL` (Slack/Discord webhook, FastAPI backend, etc.) with optional bearer auth and a 5 s timeout; falls back to console logging in local dev
- [x] Cutover artifacts for `blog.julianwiley.com → julianwiley.com` shipped under [`julianwileymac.github.io/cutover/`](https://github.com/julianwileymac/julianwileymac.github.io/tree/main/cutover) — opt-in `baseof.html` override + Netlify-style `_redirects` + single-page hard cutover stub. Not activated by default.

### Phase 3 bootstrap checklist (one-time, manual)

1. Register OAuth apps in [Azure Portal](https://portal.azure.com) and the [Google Cloud Console](https://console.cloud.google.com), set the callback URL to `https://julianwiley.com/api/auth/callback/{microsoft-entra-id|google}`, push the credentials into the cluster Secret per [`portal/README.md`](https://github.com/julianwileymac/rpi_kubernetes/blob/main/kubernetes/base-services/portal/README.md).
2. Add `ADMIN_EMAILS=julian@julianwiley.com` (or whatever email Entra/Google returns) to the same Secret so the OIDC user lands as `admin` instead of `viewer`.
3. Set `PROMETHEUS_URL=http://prometheus-operated.observability.svc.cluster.local:9090` (or the actual service name produced by your kube-prometheus-stack install) in the portal `ConfigMap` to surface live KPIs.
4. Optionally set `CONTACT_FORWARD_URL` (and `CONTACT_FORWARD_TOKEN`) to wire the contact form to a Slack/Discord webhook or the FastAPI management backend.
5. When the new portal is stable, follow [`julianwileymac.github.io/cutover/README.md`](https://github.com/julianwileymac/julianwileymac.github.io/tree/main/cutover) to redirect the legacy blog.

## Deployment

This is a **Node** server build — `node server.js` (Next.js standalone output) in a container. The marketing pages are statically generated at build time (`generateStaticParams` on `/projects/[slug]` and `/blog/[slug]`), but auth and the API routes require a server, so static export (`output: "export"`) is intentionally **not** used.

### Local

```bash
npm run build
npm start
```

### Container

```bash
docker build -t portal:dev .
docker run --rm -p 3000:3000 \
  -e AUTH_SECRET="$(openssl rand -base64 32)" \
  portal:dev
```

### Kubernetes (rpi_kubernetes cluster)

The full deploy is GitOps-style — push to `main`, let the
[`docker.yml`](.github/workflows/docker.yml) workflow build and push the
image, then either re-apply the kustomization or bump the image tag:

```bash
# In the rpi_kubernetes repo:
kubectl apply -k kubernetes/base-services/portal/
kubectl -n web rollout status deploy/portal

# Cut over to a specific image:
kubectl -n web set image deploy/portal portal=ghcr.io/julianwileymac/portal:sha-<short>
```

Public exposure goes through Cloudflare Tunnel (no router port-forward,
TLS terminated at Cloudflare). See
[`rpi_kubernetes/kubernetes/base-services/cloudflared/README.md`](https://github.com/julianwileymac/rpi_kubernetes/blob/main/kubernetes/base-services/cloudflared/README.md)
for the one-time `cloudflared tunnel login / create / route dns` bootstrap.

Production env vars (set in the k8s `Secret/portal-credentials` and
`ConfigMap/portal-config` in the `web` namespace):

| Var                                    | Where      | Notes |
| -------------------------------------- | ---------- | ----- |
| `AUTH_SECRET`                          | Secret     | Required. `openssl rand -base64 32`. |
| `AUTH_URL`                             | ConfigMap  | `https://julianwiley.com` |
| `AUTH_TRUST_HOST`                      | ConfigMap  | `true` |
| `AUTH_MICROSOFT_ENTRA_ID_ID`/`_SECRET` | Secret     | OIDC; leave blank to disable the provider |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER`       | ConfigMap  | `https://login.microsoftonline.com/common/v2.0` |
| `AUTH_GOOGLE_ID`/`_SECRET`             | Secret     | OIDC; leave blank to disable the provider |
| `ADMIN_EMAILS`                         | Secret     | Comma list — promotes matching OIDC users to `admin` |
| `EDITOR_EMAILS`                        | Secret     | Comma list — promotes matching OIDC users to `editor` |
| `PROMETHEUS_URL`                       | ConfigMap  | e.g. `http://prometheus-operated.observability.svc.cluster.local:9090`; leave blank to disable live KPIs |
| `CONTACT_FORWARD_URL`                  | Secret     | Optional outbound webhook for contact form (Slack/Discord/FastAPI) |
| `CONTACT_FORWARD_TOKEN`                | Secret     | Optional bearer token for the above |
| `NEXT_PUBLIC_SITE_URL`                 | ConfigMap  | `https://julianwiley.com` |

## License

Source code: MIT. Content (`content/posts/**`, `lib/data/**`): © 2026 Julian Wiley, all rights reserved.
