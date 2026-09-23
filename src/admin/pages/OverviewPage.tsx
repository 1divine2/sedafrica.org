import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function OverviewPage() {
  const [stats, setStats] = useState({
    articles: 0,
    published: 0,
    donations: 0,
    donationTotal: 0,
    messages: 0,
    unreadMessages: 0,
    volunteers: 0,
    subscribers: 0,
    photos: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Array<{
    id: string; name: string; email: string; message: string; created_at: string; is_read: boolean;
  }>>([]);
  const [recentDonations, setRecentDonations] = useState<Array<{
    id: string; amount: number; currency: string; donor_name: string | null; purpose: string | null; created_at: string;
  }>>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [articles, published, donations, messages, unread, volunteers, subs, photos, recentMsgs, recentDons] = await Promise.all([
      supabase.from("news_articles").select("id", { count: "exact", head: true }),
      supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("donations").select("id, amount"),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("volunteers").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("photos").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

    const totalDonations = (donations.data || []).reduce((sum, d) => sum + Number(d.amount), 0);

    setStats({
      articles: articles.count || 0,
      published: published.count || 0,
      donations: (donations.data || []).length,
      donationTotal: totalDonations,
      messages: messages.count || 0,
      unreadMessages: unread.count || 0,
      volunteers: volunteers.count || 0,
      subscribers: subs.count || 0,
      photos: photos.count || 0,
    });
    setRecentMessages(recentMsgs.data || []);
    setRecentDonations(recentDons.data || []);
  }

  const cards = [
    { label: "Published Articles", value: stats.published, total: `${stats.articles} total`, color: "#22a05a" },
    { label: "Total Donations", value: `\u20AC${stats.donationTotal.toLocaleString()}`, total: `${stats.donations} donations`, color: "#0d4fa4" },
    { label: "Messages", value: stats.messages, total: `${stats.unreadMessages} unread`, color: "#d97706" },
    { label: "Volunteers", value: stats.volunteers, total: "applications", color: "#7c3aed" },
    { label: "Subscribers", value: stats.subscribers, total: "newsletter", color: "#059669" },
    { label: "Photos", value: stats.photos, total: "in gallery", color: "#0891b2" },
  ];

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor your website activity and manage content</p>
      </div>

      <div className="stats-cards">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-card-bar" style={{ backgroundColor: card.color }} />
            <div className="stat-card-value">{card.value}</div>
            <div className="stat-card-label">{card.label}</div>
            <div className="stat-card-total">{card.total}</div>
          </div>
        ))}
      </div>

      <div className="overview-grid">
        <div className="overview-section">
          <h2>Recent Messages</h2>
          {recentMessages.length === 0 ? (
            <p className="empty-state">No messages yet</p>
          ) : (
            <div className="overview-list">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={`overview-item ${!msg.is_read ? "unread" : ""}`}>
                  <div className="overview-item-header">
                    <strong>{msg.name}</strong>
                    <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <p>{msg.message.length > 100 ? msg.message.slice(0, 100) + "..." : msg.message}</p>
                  <small>{msg.email}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overview-section">
          <h2>Recent Donations</h2>
          {recentDonations.length === 0 ? (
            <p className="empty-state">No donations yet</p>
          ) : (
            <div className="overview-list">
              {recentDonations.map((don) => (
                <div key={don.id} className="overview-item">
                  <div className="overview-item-header">
                    <strong>{don.donor_name || "Anonymous"}</strong>
                    <span className="donation-amount">{don.currency === "EUR" ? "\u20AC" : don.currency}{don.amount}</span>
                  </div>
                  <small>{don.purpose || "General"} &middot; {new Date(don.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
