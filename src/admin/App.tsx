import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./DashboardLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { NewsPage } from "./pages/NewsPage";
import { ContentPage } from "./pages/ContentPage";
import { PhotosPage } from "./pages/PhotosPage";
import { DonationsPage } from "./pages/DonationsPage";
import { MessagesPage } from "./pages/MessagesPage";
import { VolunteersPage } from "./pages/VolunteersPage";
import { NewsletterPage } from "./pages/NewsletterPage";

export function App() {
  const { session, adminUser, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!session || !adminUser) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/volunteers" element={<VolunteersPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
