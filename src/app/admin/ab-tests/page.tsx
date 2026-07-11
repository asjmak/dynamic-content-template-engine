import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteAbTest, toggleAbTest } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export default async function AbTestsPage() {
  await requireAdmin();
  await requireAdmin();
  const supabase = createServerClient();

  const { data: tests } = await supabase
    .from("ab_tests")
    .select("*, sections(title, template)")
    .order("created_at", { ascending: false });

  // Ambil statistik lead per test.
  const testIds = (tests ?? []).map((t: any) => t.id);
  let stats: Record<string, { a: number; b: number }> = {};
  if (testIds.length > 0) {
    const { data: leadCounts } = await supabase
      .from("leads")
      .select("ab_test_id, ab_variant")
      .in("ab_test_id", testIds);

    for (const t of testIds) stats[t] = { a: 0, b: 0 };
    for (const row of leadCounts ?? []) {
      if (!row.ab_test_id) continue;
      const bucket = String(row.ab_variant).toUpperCase();
      if (bucket === "A") stats[row.ab_test_id].a++;
      if (bucket === "B") stats[row.ab_test_id].b++;
    }
  }

  return (
    <div>
      <div className="row-between">
        <h1>A / B Tests</h1>
        <Link className="btn" href="/admin/ab-tests/new">
          + New A/B Test
        </Link>
      </div>
      <p>
        Swap one content item between variant A (control) and B. Visitors are
        split 50/50 automatically. Lead results are counted per variant below.
      </p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Template</th>
            <th>Section</th>
            <th>Variant A</th>
            <th>Variant B</th>
            <th>Leads A</th>
            <th>Leads B</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(tests ?? []).map((t: any) => {
            const st = stats[t.id] ?? { a: 0, b: 0 };
            const total = st.a + st.b;
            const pctA = total ? Math.round((st.a / total) * 100) : 0;
            const pctB = total ? Math.round((st.b / total) * 100) : 0;
            return (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.sections?.template || "—"}</td>
                <td>{t.sections?.title || "—"}</td>
                <td>
                  <code>{t.content_a_id.slice(0, 8)}…</code>
                </td>
                <td>
                  <code>{t.content_b_id.slice(0, 8)}…</code>
                </td>
                <td>
                  {st.a}
                  <span
                    style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}
                  >
                    ({pctA}%)
                  </span>
                </td>
                <td>
                  {st.b}
                  <span
                    style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}
                  >
                    ({pctB}%)
                  </span>
                </td>
                <td>
                  {t.is_active ? (
                    <span style={{ color: "#16a34a" }}>● Active</span>
                  ) : (
                    <span style={{ color: "#94a3b8" }}>○ Paused</span>
                  )}
                </td>
                <td className="table-actions">
                  <form action={toggleAbTest}>
                    <input type="hidden" name="id" value={t.id} />
                    <input
                      type="hidden"
                      name="is_active"
                      value={t.is_active ? "false" : "true"}
                    />
                    <button type="submit" className="btn-link">
                      {t.is_active ? "Pause" : "Activate"}
                    </button>
                  </form>
                  <ConfirmDeleteForm
                    action={deleteAbTest}
                    id={t.id}
                    message="Delete this A/B test? (statistics in leads will remain)."
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {(!tests || tests.length === 0) && (
        <p style={{ color: "#64748b", marginTop: 24 }}>
          No A/B tests yet. Use the “New A/B Test” button to create one.
        </p>
      )}
    </div>
  );
}
