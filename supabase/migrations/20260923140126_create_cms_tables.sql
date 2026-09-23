/*
# Create CMS Tables for SEDAfrica Website Management System

1. New Tables

- `admin_users` — Tracks admin/editor roles for authenticated users
  - `id` (uuid, PK, references auth.users)
  - `email` (text, not null)
  - `full_name` (text)
  - `role` (text, default 'editor') — 'admin' or 'editor'
  - `created_at` (timestamptz)

- `news_articles` — News/blog articles with publication workflow
  - `id` (uuid, PK)
  - `title` (text, not null)
  - `slug` (text, unique)
  - `category` (text)
  - `summary` (text)
  - `content` (text)
  - `image_url` (text)
  - `status` (text, default 'draft') — 'draft', 'published', 'archived'
  - `author_id` (uuid, references admin_users)
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `site_content` — Editable content blocks for website sections
  - `id` (uuid, PK)
  - `section_key` (text, unique, not null) — e.g. 'hero_title', 'mission_text'
  - `content` (text)
  - `metadata` (jsonb) — extra structured data
  - `updated_at` (timestamptz)
  - `updated_by` (uuid, references admin_users)

- `photos` — Photo gallery management
  - `id` (uuid, PK)
  - `title` (text)
  - `description` (text)
  - `url` (text, not null)
  - `category` (text)
  - `uploaded_by` (uuid, references admin_users)
  - `created_at` (timestamptz)

- `donations` — Donation records
  - `id` (uuid, PK)
  - `amount` (numeric, not null)
  - `currency` (text, default 'EUR')
  - `frequency` (text) — 'single' or 'monthly'
  - `purpose` (text)
  - `donor_name` (text)
  - `donor_email` (text)
  - `status` (text, default 'pending')
  - `created_at` (timestamptz)

- `contact_messages` — Messages from the contact form
  - `id` (uuid, PK)
  - `name` (text, not null)
  - `email` (text, not null)
  - `message` (text, not null)
  - `is_read` (boolean, default false)
  - `created_at` (timestamptz)

- `volunteers` — Volunteer applications
  - `id` (uuid, PK)
  - `full_name` (text, not null)
  - `email` (text, not null)
  - `phone` (text)
  - `role` (text)
  - `status` (text, default 'pending')
  - `created_at` (timestamptz)

- `newsletter_subscribers` — Newsletter email list
  - `id` (uuid, PK)
  - `email` (text, unique, not null)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)

2. Security
- RLS enabled on all tables.
- Public tables (contact_messages, donations, volunteers, newsletter_subscribers): anon can INSERT, authenticated admins can read/update/delete.
- Admin tables (admin_users, news_articles, site_content, photos): authenticated users with admin role can CRUD.
- news_articles: anon can SELECT published articles (for public website).
- site_content: anon can SELECT (for public website rendering).
- photos: anon can SELECT (for public website rendering).

3. Indexes
- news_articles: index on status, slug, category
- site_content: index on section_key
- contact_messages: index on is_read
- donations: index on created_at
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select" ON admin_users;
CREATE POLICY "admin_users_select" ON admin_users FOR SELECT
  TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

DROP POLICY IF EXISTS "admin_users_insert" ON admin_users;
CREATE POLICY "admin_users_insert" ON admin_users FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

DROP POLICY IF EXISTS "admin_users_update" ON admin_users;
CREATE POLICY "admin_users_update" ON admin_users FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

DROP POLICY IF EXISTS "admin_users_delete" ON admin_users;
CREATE POLICY "admin_users_delete" ON admin_users FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  category text,
  summary text,
  content text,
  image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id uuid REFERENCES admin_users(id),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);

DROP POLICY IF EXISTS "news_articles_public_select" ON news_articles;
CREATE POLICY "news_articles_public_select" ON news_articles FOR SELECT
  TO anon, authenticated USING (status = 'published' OR EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "news_articles_insert" ON news_articles;
CREATE POLICY "news_articles_insert" ON news_articles FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "news_articles_update" ON news_articles;
CREATE POLICY "news_articles_update" ON news_articles FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "news_articles_delete" ON news_articles;
CREATE POLICY "news_articles_delete" ON news_articles FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  content text,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(section_key);

DROP POLICY IF EXISTS "site_content_public_select" ON site_content;
CREATE POLICY "site_content_public_select" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "site_content_insert" ON site_content;
CREATE POLICY "site_content_insert" ON site_content FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "site_content_update" ON site_content;
CREATE POLICY "site_content_update" ON site_content FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "site_content_delete" ON site_content;
CREATE POLICY "site_content_delete" ON site_content FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  url text NOT NULL,
  category text,
  uploaded_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "photos_public_select" ON photos;
CREATE POLICY "photos_public_select" ON photos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "photos_insert" ON photos;
CREATE POLICY "photos_insert" ON photos FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "photos_update" ON photos;
CREATE POLICY "photos_update" ON photos FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "photos_delete" ON photos;
CREATE POLICY "photos_delete" ON photos FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'EUR',
  frequency text CHECK (frequency IN ('single', 'monthly')),
  purpose text,
  donor_name text,
  donor_email text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);

DROP POLICY IF EXISTS "donations_anon_insert" ON donations;
CREATE POLICY "donations_anon_insert" ON donations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "donations_admin_select" ON donations;
CREATE POLICY "donations_admin_select" ON donations FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "donations_admin_update" ON donations;
CREATE POLICY "donations_admin_update" ON donations FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "donations_admin_delete" ON donations;
CREATE POLICY "donations_admin_delete" ON donations FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);

DROP POLICY IF EXISTS "contact_messages_anon_insert" ON contact_messages;
CREATE POLICY "contact_messages_anon_insert" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contact_messages_admin_select" ON contact_messages;
CREATE POLICY "contact_messages_admin_select" ON contact_messages FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "contact_messages_admin_update" ON contact_messages;
CREATE POLICY "contact_messages_admin_update" ON contact_messages FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "contact_messages_admin_delete" ON contact_messages;
CREATE POLICY "contact_messages_admin_delete" ON contact_messages FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "volunteers_anon_insert" ON volunteers;
CREATE POLICY "volunteers_anon_insert" ON volunteers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "volunteers_admin_select" ON volunteers;
CREATE POLICY "volunteers_admin_select" ON volunteers FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "volunteers_admin_update" ON volunteers;
CREATE POLICY "volunteers_admin_update" ON volunteers FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "volunteers_admin_delete" ON volunteers;
CREATE POLICY "volunteers_admin_delete" ON volunteers FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_anon_insert" ON newsletter_subscribers;
CREATE POLICY "newsletter_anon_insert" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_admin_select" ON newsletter_subscribers;
CREATE POLICY "newsletter_admin_select" ON newsletter_subscribers FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "newsletter_admin_update" ON newsletter_subscribers;
CREATE POLICY "newsletter_admin_update" ON newsletter_subscribers FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid()));

DROP POLICY IF EXISTS "newsletter_admin_delete" ON newsletter_subscribers;
CREATE POLICY "newsletter_admin_delete" ON newsletter_subscribers FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.id = auth.uid() AND au.role = 'admin'));

-- Seed initial site content
INSERT INTO site_content (section_key, content, metadata) VALUES
  ('hero_title', 'Social and Economic Development for Africa', '{}'),
  ('hero_subtitle', 'SEDA works with government and international partners to build human capacity, support vulnerable people, empower women, and strengthen rural communities in Sierra Leone.', '{}'),
  ('mission_text', 'SEDA aims to build human capacity, help poor and vulnerable people, empower women, and provide relief while raising the effectiveness of communities.', '{}'),
  ('contact_phone', '+232-76-920-000', '{}'),
  ('contact_email', 'info@sedafrica.org', '{}'),
  ('contact_address', 'No. 13 Walpole Street, Freetown, Sierra Leone', '{}')
ON CONFLICT (section_key) DO NOTHING;
