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

- [ ] Re-enable real MDX (`@mdx-js/react` + `next-mdx-remote` once the React-version-mismatch issue around mixing RSC + MDX in Next.js 15 + React 18 is resolved upstream) so `<Note>`, `<Callout>`, `<Mermaid>`, `<TechStack>`, `<ProjectShowcase>`, and `<CodeTabs>` render in posts. Components are already implemented under `components/mdx/`.
- [ ] Hand-port `{{< project-showcase >}}`, `{{< code-tabs >}}`, and `{{< tech-stack >}}` blocks in `content/posts/project-writeup-template.mdx` and `content/posts/technical-template.mdx` once MDX is back.
- [ ] Migrate `content/notes/` (Bash, Go) from the Hugo site (deferred to Phase 3).
- [ ] Migrate `content/docs/` (Getting Started, Tutorials, Guides) from the Hugo site (deferred to Phase 3).

## Phase roadmap

### Phase 1 — Foundation (this commit)

- [x] Next.js 15 + AntD + Pro Components scaffold
- [x] Brand tokens, Mulish font, marketing shell + footer
- [x] All YAML data migrated to typed TS modules
- [x] Public pages: landing, about, projects (gallery + detail), blog (index + detail), links, contact
- [x] 56 blog posts migrated to MDX
- [x] NextAuth v5 with Entra + Google + dev Credentials
- [x] Auth-gated `/app/*` admin dashboard with ProLayout, project rooms, blog admin table, contact inbox stub

### Phase 2 — Kubernetes + Cloudflare Tunnel (shipped)

- [x] Multi-arch `Dockerfile` (linux/amd64 + linux/arm64) with Next.js standalone output and read-only rootfs runtime
- [x] `.github/workflows/docker.yml` → `buildx` → `ghcr.io/julianwileymac/portal` (tags `latest`, `main`, `sha-<short>`, semver on `v*.*.*` tags)
- [x] Manifests in `rpi_kubernetes/kubernetes/base-services/portal/` (ConfigMap, placeholder Secret, Deployment with 2 replicas + spread constraint, ClusterIP Service, Ingress for `julianwiley.com` and `portal.local`)
- [x] `cloudflared` Deployment + Secret stub + ConfigMap under `rpi_kubernetes/kubernetes/base-services/cloudflared/` routing `julianwiley.com` and `www.julianwiley.com` to `ingress-nginx`
- [x] New `web` and `edge` namespaces added to `rpi_kubernetes/kubernetes/namespaces/namespaces.yaml`
- [x] Both new paths registered in `rpi_kubernetes/kubernetes/kustomization.yaml`
- [ ] One-time bootstrap (run by hand once Cloudflare account access is sorted): `cloudflared tunnel login` → `cloudflared tunnel create julianwiley-portal` → `cloudflared tunnel route dns julianwiley-portal julianwiley.com` → push the credentials JSON into `Secret/cloudflared-credentials`

### Phase 3 — Polish (future round)

- [ ] Real Entra ID + Google client IDs and role-based access
- [ ] Live Prometheus KPIs from the cluster
- [ ] G6 topology diagram for project deployments (`Deployment → Service → Ingress`)
- [ ] Migrate `content/notes/` and `content/docs/` from the Hugo site
- [ ] `/api/contact` forwards to FastAPI backend in `rpi_kubernetes/management/`
- [ ] `301 blog.julianwiley.com/*` → `julianwiley.com/blog/*` and retire the Hugo site

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

- `AUTH_SECRET` (required) — `openssl rand -base64 32`
- `AUTH_URL=https://julianwiley.com`
- `AUTH_TRUST_HOST=true`
- `AUTH_MICROSOFT_ENTRA_ID_ID`, `AUTH_MICROSOFT_ENTRA_ID_SECRET`, `AUTH_MICROSOFT_ENTRA_ID_ISSUER`
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- `NEXT_PUBLIC_SITE_URL=https://julianwiley.com`

## License

Source code: MIT. Content (`content/posts/**`, `lib/data/**`): © 2026 Julian Wiley, all rights reserved.
