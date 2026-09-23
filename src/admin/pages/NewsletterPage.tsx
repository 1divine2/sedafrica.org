import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { NewsletterSubscriber } from "../types";

export function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  useEffect(() => { loadSubscribers(); }, []);

  async function loadSubscribers() {
    const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    setSubscribers(data || []);
  }

  async function toggleActive(id: string, isActive: boolean) {
    await supabase.from("newsletter_subscribers").update({ is_active: !isActive }).eq("id", id);
    loadSubscribers();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    loadSubscribers();
  }

  function exportCSV() {
    const active = subscribers.filter((s) => s.is_active);
    const csv = "email,subscribed_date\n" + active.map((s) => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seda-newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeCount = subscribers.filter((s) => s.is_active).length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Newsletter Subscribers</h1>
          <p>{activeCount} active subscribers out of {subscribers.length} total</p>
        </div>
        <button className="btn-primary" onClick={exportCSV}>Export CSV</button>
      </div>

      {subscribers.length === 0 ? (
        <div className="empty-state-box"><p>No subscribers yet.</p></div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Email</th><th>Status</th><th>Subscribed</th><th>Actions</th></tr></thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td><strong>{sub.email}</strong></td>
                  <td><span className={`status-badge ${sub.is_active ? "published" : "archived"}`}>{sub.is_active ? "Active" : "Inactive"}</span></td>
                  <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="btn-sm btn-outline" onClick={() => toggleActive(sub.id, sub.is_active)}>
                      {sub.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(sub.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
