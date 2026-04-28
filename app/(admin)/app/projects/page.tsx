import { projects } from "@/lib/data/projects";
import { AdminProjectsGrid } from "@/components/admin/AdminProjectsGrid";

export default function AdminProjectsPage() {
  return <AdminProjectsGrid projects={projects} />;
}
