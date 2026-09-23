import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import type { NewsArticle } from "../types";

export function NewsPage() {
  const { adminUser } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", category: "Community", summary: "", content: "", image_url: "", status: "draft" as "draft" | "published" | "archived" });

  useEffect(() => { loadArticles(); }, []);

  async function loadArticles() {
    const { data } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false });
    setArticles(data || []);
  }

  function openCreate() {
    setForm({ title: "", slug: "", category: "Community", summary: "", content: "", image_url: "", status: "draft" as const });
    setEditing(null);
    setCreating(true);
  }

  function openEdit(article: NewsArticle) {
    setForm({
      title: article.title,
      slug: article.slug || "",
      category: article.category || "Community",
      summary: article.summary || "",
      content: article.content || "",
      image_url: article.image_url || "",
      status: article.status,
    });
    setEditing(article);
    setCreating(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = {
      ...form,
      slug,
      author_id: adminUser?.id,
      published_at: form.status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      await supabase.from("news_articles").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("news_articles").insert(payload);
    }
    setCreating(false);
    setEditing(null);
    loadArticles();
  }

  async function handlePublish(article: NewsArticle) {
    const newStatus = article.status === "published" ? "draft" : "published";
    await supabase.from("news_articles").update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq("id", article.id);
    loadArticles();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await supabase.from("news_articles").delete().eq("id", id);
    loadArticles();
  }

  const filtered = filter === "all" ? articles : articles.filter((a) => a.status === filter);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>News & Publications</h1>
          <p>Create and manage news articles for your website</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Article</button>
      </div>

      {creating && (
        <div className="modal-overlay" onClick={() => setCreating(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Edit Article" : "New Article"}</h2>
              <button className="modal-close" onClick={() => setCreating(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <label>Title <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Article title" /></label>
              <label>URL Slug <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" /></label>
              <div className="form-row">
                <label>Category
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option>Community</option><option>Education</option><option>Agriculture</option><option>Gender</option><option>General</option>
                  </select>
                </label>
                <label>Status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })}>
                    <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label>Summary <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} placeholder="Brief summary" /></label>
              <label>Content <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Full article content" /></label>
              <label>Image URL <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></label>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editing ? "Update" : "Create"} Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filter-bar">
        {(["all", "draft", "published", "archived"] as const).map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${articles.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-box">
          <p>No articles found. Create your first article to get started.</p>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((article) => (
                <tr key={article.id}>
                  <td><strong>{article.title}</strong>{article.summary && <small className="table-sub">{article.summary.slice(0, 60)}...</small>}</td>
                  <td><span className="tag">{article.category}</span></td>
                  <td><span className={`status-badge ${article.status}`}>{article.status}</span></td>
                  <td>{new Date(article.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="btn-sm" onClick={() => openEdit(article)}>Edit</button>
                    <button className="btn-sm btn-outline" onClick={() => handlePublish(article)}>
                      {article.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(article.id)}>Delete</button>
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
