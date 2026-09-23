import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { Volunteer } from "../types";

export function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => { loadVolunteers(); }, []);

  async function loadVolunteers() {
    const { data } = await supabase.from("volunteers").select("*").order("created_at", { ascending: false });
    setVolunteers(data || []);
  }

  async function updateStatus(id: string, status: Volunteer["status"]) {
    await supabase.from("volunteers").update({ status }).eq("id", id);
    loadVolunteers();
  }

  const filtered = filter === "all" ? volunteers : volunteers.filter((v) => v.status === filter);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Volunteer Applications</h1>
          <p>Review and manage volunteer submissions</p>
        </div>
      </div>

      <div className="filter-bar">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${volunteers.filter((v) => v.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-box"><p>No volunteer applications found.</p></div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((vol) => (
                <tr key={vol.id}>
                  <td><strong>{vol.full_name}</strong></td>
                  <td><a href={`mailto:${vol.email}`}>{vol.email}</a></td>
                  <td>{vol.phone || "-"}</td>
                  <td>{vol.role || "-"}</td>
                  <td><span className={`status-badge ${vol.status}`}>{vol.status}</span></td>
                  <td>{new Date(vol.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {vol.status === "pending" && (
                      <>
                        <button className="btn-sm" onClick={() => updateStatus(vol.id, "approved")}>Approve</button>
                        <button className="btn-sm btn-danger" onClick={() => updateStatus(vol.id, "rejected")}>Reject</button>
                      </>
                    )}
                    {vol.status !== "pending" && (
                      <button className="btn-sm btn-outline" onClick={() => updateStatus(vol.id, "pending")}>Reset</button>
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
