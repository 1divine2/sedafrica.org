import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import type { Photo } from "../types";

export function PhotosPage() {
  const { adminUser } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "General", url: "" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { loadPhotos(); }, []);

  async function loadPhotos() {
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    setPhotos(data || []);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    let photoUrl = form.url;

    if (file) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("website-photos")
        .upload(fileName, file);

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("website-photos")
        .getPublicUrl(fileName);
      photoUrl = urlData.publicUrl;
    }

    if (!photoUrl) {
      alert("Please select a file or enter a URL");
      setUploading(false);
      return;
    }

    await supabase.from("photos").insert({
      title: form.title || null,
      description: form.description || null,
      category: form.category,
      url: photoUrl,
      uploaded_by: adminUser?.id,
    });

    setShowUpload(false);
    setForm({ title: "", description: "", category: "General", url: "" });
    setFile(null);
    setUploading(false);
    loadPhotos();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    await supabase.from("photos").delete().eq("id", id);
    loadPhotos();
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Photo Gallery</h1>
          <p>Upload and manage website photos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(true)}>+ Upload Photo</button>
      </div>

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Photo</h2>
              <button className="modal-close" onClick={() => setShowUpload(false)}>&times;</button>
            </div>
            <form onSubmit={handleUpload} className="modal-form">
              <label>
                Choose File
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
              <div className="or-divider"><span>or enter a URL</span></div>
              <label>Image URL <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></label>
              <label>Title <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Photo title" /></label>
              <label>Description <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional description" /></label>
              <label>Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>General</option><option>Education</option><option>Agriculture</option><option>Community</option><option>Events</option><option>Team</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="empty-state-box">
          <p>No photos uploaded yet. Start by uploading your first photo.</p>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <div className="photo-card-image">
                <img src={photo.url} alt={photo.title || "Photo"} loading="lazy" />
              </div>
              <div className="photo-card-info">
                <strong>{photo.title || "Untitled"}</strong>
                {photo.description && <p>{photo.description}</p>}
                <div className="photo-card-meta">
                  <span className="tag">{photo.category}</span>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(photo.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
