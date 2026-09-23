import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { Donation } from "../types";

export function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "failed">("all");

  useEffect(() => { loadDonations(); }, []);

  async function loadDonations() {
    const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    setDonations(data || []);
  }

  async function updateStatus(id: string, status: Donation["status"]) {
    await supabase.from("donations").update({ status }).eq("id", id);
    loadDonations();
  }

  const filtered = filter === "all" ? donations : donations.filter((d) => d.status === filter);
  const totalCompleted = donations.filter((d) => d.status === "completed").reduce((s, d) => s + Number(d.amount), 0);
  const totalPending = donations.filter((d) => d.status === "pending").reduce((s, d) => s + Number(d.amount), 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Donations</h1>
          <p>Track and manage all donation records</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="mini-stat">
          <span className="mini-stat-value">{"\u20AC"}{totalCompleted.toLocaleString()}</span>
          <span className="mini-stat-label">Completed</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value">{"\u20AC"}{totalPending.toLocaleString()}</span>
          <span className="mini-stat-label">Pending</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat-value">{donations.length}</span>
          <span className="mini-stat-label">Total Records</span>
        </div>
      </div>

      <div className="filter-bar">
        {(["all", "pending", "completed", "failed"] as const).map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-box"><p>No donations found.</p></div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Donor</th><th>Amount</th><th>Purpose</th><th>Frequency</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((don) => (
                <tr key={don.id}>
                  <td><strong>{don.donor_name || "Anonymous"}</strong><small className="table-sub">{don.donor_email || ""}</small></td>
                  <td className="amount-cell">{don.currency === "EUR" ? "\u20AC" : don.currency}{Number(don.amount).toLocaleString()}</td>
                  <td>{don.purpose || "General"}</td>
                  <td>{don.frequency || "-"}</td>
                  <td><span className={`status-badge ${don.status}`}>{don.status}</span></td>
                  <td>{new Date(don.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {don.status === "pending" && (
                      <>
                        <button className="btn-sm" onClick={() => updateStatus(don.id, "completed")}>Complete</button>
                        <button className="btn-sm btn-danger" onClick={() => updateStatus(don.id, "failed")}>Failed</button>
                      </>
                    )}
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
