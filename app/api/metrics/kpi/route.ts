import { NextResponse } from "next/server";
import { fetchClusterKpis } from "@/lib/prometheus";
import { getAccess } from "@/lib/access";

// Always run on every request — Prometheus values must not be cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const access = await getAccess();
  if (!access.signedIn) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const kpis = await fetchClusterKpis();
  return NextResponse.json(kpis, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
