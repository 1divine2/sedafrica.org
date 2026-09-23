export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor";
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  status: "draft" | "published" | "archived";
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  section_key: string;
  content: string | null;
  metadata: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
}

export interface Photo {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  category: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  frequency: string | null;
  purpose: string | null;
  donor_name: string | null;
  donor_email: string | null;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}
