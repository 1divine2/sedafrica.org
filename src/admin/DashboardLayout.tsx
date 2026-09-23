import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

const navItems = [
  { to: "/", icon: "grid", label: "Overview" },
  { to: "/news", icon: "news", label: "News & Publications" },
  { to: "/content", icon: "edit", label: "Site Content" },
  { to: "/photos", icon: "image", label: "Photo Gallery" },
  { to: "/donations", icon: "heart", label: "Donations" },
  { to: "/messages", icon: "mail", label: "Messages" },
  { to: "/volunteers", icon: "users", label: "Volunteers" },
  { to: "/newsletter", icon: "send", label: "Newsletter" },
];

const icons: Record<string, React.ReactNode> = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  news: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { adminUser, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src="/seda-logo.jpg" alt="SEDA" className="sidebar-logo" />
          <div className="sidebar-brand">
            <strong>SEDA</strong>
            <small>Admin Dashboard</small>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            &times;
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{icons[item.icon]}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {adminUser?.full_name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <strong>{adminUser?.full_name || "Admin"}</strong>
              <small>{adminUser?.role}</small>
            </div>
          </div>
          <button className="sidebar-signout" onClick={signOut}>
            Sign Out
          </button>
          <a href="/" className="sidebar-view-site" target="_blank" rel="noopener noreferrer">
            View Website
          </a>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="topbar-welcome">
            Welcome back, <strong>{adminUser?.full_name?.split(" ")[0] || "Admin"}</strong>
          </div>
          <span className="topbar-role">{adminUser?.role}</span>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
