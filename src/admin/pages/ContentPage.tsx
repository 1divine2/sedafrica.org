import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import type { SiteContent } from "../types";

const sectionLabels: Record<string, string> = {
  hero_title: "Hero Section Title",
  hero_subtitle: "Hero Section Description",
  mission_text: "Mission Section Text",
  contact_phone: "Contact Phone Number",
  contact_email: "Contact Email Address",
  contact_address: "Office Address",
};

export function ContentPage() {
  const { adminUser } = useAuth();
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => { loadContent(); }, []);

  async function loadContent() {
    const { data } = await supabase.from("site_content").select("*").order("section_key");
    setContents(data || []);
  }

  async function handleSave(item: SiteContent) {
    setSaving(true);
    await supabase.from("site_content").update({
      content: editValue,
      updated_at: new Date().toISOString(),
      updated_by: adminUser?.id,
    }).eq("id", item.id);
    setEditing(null);
    setSaving(false);
    loadContent();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("site_content").insert({
      section_key: newKey.toLowerCase().replace(/\s+/g, "_"),
      content: newContent,
      updated_by: adminUser?.id,
    });
    setAdding(false);
    setNewKey("");
    setNewContent("");
    loadContent();
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Site Content</h1>
          <p>Edit text and information displayed on your website</p>
        </div>
        <button className="btn-primary" onClick={() => setAdding(true)}>+ Add Content Block</button>
      </div>

      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Content Block</h2>
              <button className="modal-close" onClick={() => setAdding(false)}>&times;</button>
            </div>
            <form onSubmit={handleAdd} className="modal-form">
              <label>Section Key <input required value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. footer_tagline" /></label>
              <label>Content <textarea required value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} placeholder="Content text" /></label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="content-cards">
        {contents.map((item) => (
          <div key={item.id} className="content-card">
            <div className="content-card-header">
              <h3>{sectionLabels[item.section_key] || item.section_key}</h3>
              <small className="content-key">{item.section_key}</small>
            </div>
            {editing === item.id ? (
              <div className="content-edit">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                />
                <div className="content-edit-actions">
                  <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                  <button className="btn-primary" onClick={() => handleSave(item)} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="content-value">{item.content || "(empty)"}</p>
                <div className="content-card-footer">
                  <small>Updated {new Date(item.updated_at).toLocaleDateString()}</small>
                  <button className="btn-sm" onClick={() => { setEditing(item.id); setEditValue(item.content || ""); }}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
