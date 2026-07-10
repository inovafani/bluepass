import { NextRequest, NextResponse } from "next/server";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";
import { loadOperatorOutreachList } from "@/lib/services/operators/operator-outreach-list";

export async function GET(request: NextRequest) {
  const admin = await requireCurrentAdmin();

  if (!admin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const filter = request.nextUrl.searchParams.get("filter") ?? "all";
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const outreach = await loadOperatorOutreachList({
    filter,
    q,
    pageSize: 1000,
    baseUrl: request.nextUrl.origin,
  });
  const csv = toCsv([
    ["slug", "name", "status", "email", "phone", "region", "category", "claim_url", "public_url"],
    ...outreach.leads.map((lead) => [
      lead.slug,
      lead.name,
      lead.status,
      lead.email ?? "",
      lead.phone ?? "",
      lead.region ?? "",
      lead.category ?? "",
      lead.claimUrl,
      lead.publicUrl,
    ]),
  ]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bluepass-operator-outreach-${outreach.activeFilter}.csv"`,
    },
  });
}

function toCsv(rows: string[][]) {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function escapeCsvCell(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}
