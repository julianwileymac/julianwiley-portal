import { auth } from "@/lib/auth";
import { projects } from "@/lib/data/projects";
import { getAllPostMeta } from "@/lib/mdx";
import { Dashboard } from "@/components/admin/Dashboard";

export default async function DashboardPage() {
  const session = await auth();
  const posts = getAllPostMeta();
  const lastUpdated = posts[0]?.isoDate
    ? new Date(posts[0].isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
  const servicesCount = projects.reduce(
    (sum, p) => sum + (p.deployments?.length ?? 0),
    0
  );

  return (
    <Dashboard
      greeting={`Welcome back, ${session?.user?.name ?? "Julian"}`}
      projectsCount={projects.length}
      postsCount={posts.length}
      servicesCount={servicesCount}
      lastUpdated={lastUpdated}
    />
  );
}
