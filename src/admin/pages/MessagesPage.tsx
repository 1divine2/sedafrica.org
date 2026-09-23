import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { ContactMessage } from "../types";

export function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
  }

  async function markRead(msg: ContactMessage) {
    if (!msg.is_read) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", msg.id);
      loadMessages();
    }
    setSelected(msg);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setSelected(null);
    loadMessages();
  }

  const filtered = filter === "all" ? messages : filter === "unread" ? messages.filter((m) => !m.is_read) : messages.filter((m) => m.is_read);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Messages</h1>
          <p>View and respond to contact form submissions {unreadCount > 0 && <span className="badge">{unreadCount} unread</span>}</p>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message from {selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
            </div>
            <div className="message-detail">
              <div className="message-meta">
                <p><strong>From:</strong> {selected.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></p>
                <p><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div className="message-body">{selected.message}</div>
              <div className="modal-actions">
                <a href={`mailto:${selected.email}?subject=Re: Your message to SEDA`} className="btn-primary">Reply via Email</a>
                <button className="btn-danger" onClick={() => handleDelete(selected.id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All ({messages.length})</button>
        <button className={`filter-btn ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>Unread ({unreadCount})</button>
        <button className={`filter-btn ${filter === "read" ? "active" : ""}`} onClick={() => setFilter("read")}>Read ({messages.length - unreadCount})</button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-box"><p>No messages found.</p></div>
      ) : (
        <div className="message-list">
          {filtered.map((msg) => (
            <div key={msg.id} className={`message-card ${!msg.is_read ? "unread" : ""}`} onClick={() => markRead(msg)}>
              <div className="message-card-header">
                <strong>{msg.name}</strong>
                <span>{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>
              <p>{msg.message.length > 120 ? msg.message.slice(0, 120) + "..." : msg.message}</p>
              <small>{msg.email}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
