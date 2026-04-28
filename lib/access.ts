import "server-only";

import { auth } from "@/lib/auth";

/**
 * Role hierarchy. Higher index = more privileged.
 * The session's `user.role` is set by the auth.ts callback chain.
 */
export const ROLES = ["viewer", "editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

export interface Access {
  /** True if a session is present at all. */
  signedIn: boolean;
  /** The signed-in user's role, or `viewer` for unauthenticated visitors. */
  role: Role;
  /** Read-only check helpers. */
  can: {
    viewDashboard: boolean;
    viewProjectRooms: boolean;
    viewBlogAdmin: boolean;
    /** Only admins should see the contact inbox (PII). */
    viewContactInbox: boolean;
    /** Reserved for editor+ once write actions land in Phase 4. */
    editBlogPosts: boolean;
    /** Reserved for admin only. */
    manageUsers: boolean;
  };
}

const VIEWER: Access = {
  signedIn: false,
  role: "viewer",
  can: {
    viewDashboard: false,
    viewProjectRooms: false,
    viewBlogAdmin: false,
    viewContactInbox: false,
    editBlogPosts: false,
    manageUsers: false,
  },
};

/** Returns the highest role index, used for "at least X" comparisons. */
function rank(role: Role): number {
  return ROLES.indexOf(role);
}

function atLeast(role: Role, min: Role): boolean {
  return rank(role) >= rank(min);
}

/**
 * Server-side access check. Resolves the current NextAuth session and folds
 * the user's role into a typed `Access` object that pages and route handlers
 * can branch on without re-implementing role math.
 *
 * Use in a server component:
 *
 *   const access = await getAccess();
 *   if (!access.can.viewContactInbox) notFound();
 */
export async function getAccess(): Promise<Access> {
  const session = await auth();
  if (!session?.user) return VIEWER;

  // Sessions created by `dev-credentials` are tagged as `admin` by lib/auth.ts.
  // Sessions from real OIDC providers default to `viewer` until explicit
  // promotion (TODO: drive from Entra group claim or an env-var allow-list).
  const rawRole = session.user.role ?? "viewer";
  const role: Role = (ROLES as readonly string[]).includes(rawRole)
    ? (rawRole as Role)
    : "viewer";

  return {
    signedIn: true,
    role,
    can: {
      viewDashboard: atLeast(role, "viewer"),
      viewProjectRooms: atLeast(role, "viewer"),
      viewBlogAdmin: atLeast(role, "editor"),
      viewContactInbox: atLeast(role, "admin"),
      editBlogPosts: atLeast(role, "editor"),
      manageUsers: atLeast(role, "admin"),
    },
  };
}

/**
 * Static role classifier driven by env-var allow-lists. Used by the JWT
 * callback in lib/auth.ts to decide which role a freshly-issued session
 * should carry. Comma-separated email lists in env vars:
 *
 *   ADMIN_EMAILS="julian@julianwiley.com"
 *   EDITOR_EMAILS="alice@example.com,bob@example.com"
 *
 * If both lists are empty the OIDC user is granted `viewer` (read-only).
 */
export function classifyEmail(email: string | null | undefined): Role {
  if (!email) return "viewer";
  const lower = email.toLowerCase();

  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (admins.includes(lower)) return "admin";

  const editors = (process.env.EDITOR_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (editors.includes(lower)) return "editor";

  return "viewer";
}
