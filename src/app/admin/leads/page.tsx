import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="row-between">
        <div>
          <h1>Leads</h1>
          <p>{data?.length ?? 0} leads captured.</p>
        </div>
        <a className="btn secondary" href="/api/leads/export">
          Export CSV
        </a>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((l: any) => (
            <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleString()}</td>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.phone || "—"}</td>
              <td>{l.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}