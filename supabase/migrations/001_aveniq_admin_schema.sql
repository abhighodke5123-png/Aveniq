-- =============================================================================
-- AVENIQ Digital Experience Studio — Production Admin & CRM Schema Migration
-- Migration: 001_aveniq_admin_schema.sql
-- Targets: Supabase PostgreSQL 15+ with Row Level Security (RLS)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUM TYPES & ROLES
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('Super Admin', 'Admin', 'Manager', 'Staff');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM (
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Negotiation',
    'Converted',
    'Lost'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'Planning',
    'In Progress',
    'Review',
    'Completed',
    'On Hold',
    'Cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2. PROFILES & USER ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Studio Member',
  department TEXT NOT NULL DEFAULT 'Engineering',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'Staff',
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id)
);

-- -----------------------------------------------------------------------------
-- 3. LEADS & ENQUIRIES (CRM)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  interested_service TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  timeline TEXT NOT NULL,
  project_description TEXT NOT NULL,
  status lead_status NOT NULL DEFAULT 'New',
  source TEXT NOT NULL DEFAULT 'Website Enquiry',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  follow_up_date DATE,
  internal_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  communication_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  converted_client_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- -----------------------------------------------------------------------------
-- 4. CLIENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  primary_contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  industry TEXT NOT NULL DEFAULT 'Healthcare',
  tier TEXT NOT NULL DEFAULT 'Enterprise',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Onboarding', 'Retainer', 'Inactive')),
  source_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  account_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_billed NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_industry ON public.clients(industry);

-- -----------------------------------------------------------------------------
-- 5. PROJECTS, MILESTONES & TASKS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  service_category TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'Planning',
  budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
  monthly_retainer NUMERIC(12, 2) NOT NULL DEFAULT 0,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  deadline DATE NOT NULL,
  lead_member_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_team_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project ON public.project_milestones(project_id);

CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Review', 'Done')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON public.project_tasks(project_id);

-- -----------------------------------------------------------------------------
-- 6. PROPOSALS, INVOICES & VERIFIED PAYMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  service_category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Declined', 'Expired')),
  valid_until DATE NOT NULL,
  scope_summary TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')),
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Stripe Gateway', 'Razorpay Gateway', 'Wire Transfer', 'Manual Entry')),
  recording_mode TEXT NOT NULL CHECK (recording_mode IN ('Gateway Verified', 'Manual Record')),
  transaction_reference TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'Pending Verification' CHECK (verification_status IN ('Pending Verification', 'Verified', 'Failed', 'Refunded')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(verification_status);

-- -----------------------------------------------------------------------------
-- 7. NOTIFICATIONS, ACTIVITY LOGS & WEBSITE SETTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'System',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT NOT NULL,
  actor_role app_role NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL DEFAULT 'AVENIQ',
  tagline TEXT NOT NULL DEFAULT 'Designed to move business forward.',
  hero_headline TEXT NOT NULL,
  contact_email TEXT NOT NULL DEFAULT 'contact@aveniqstudio.com',
  whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
  primary_geography TEXT NOT NULL DEFAULT 'India, USA, UK, Australia, Canada & Global',
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  nda_protection_banner BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user holds an authorized studio role
CREATE OR REPLACE FUNCTION public.has_studio_role(allowed_roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.user_roles ur ON ur.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
      AND p.is_active = TRUE
      AND ur.role = ANY(allowed_roles)
  );
$$;

-- Public website visitors can submit new leads ONLY (validated insert)
CREATE POLICY "Public visitors can submit new website leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'New' AND char_length(full_name) >= 2 AND char_length(project_description) >= 15);

-- Authorized Studio Staff/Managers/Admins can view and manage leads
CREATE POLICY "Studio staff can read leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager', 'Staff']::app_role[]));

CREATE POLICY "Studio managers and admins can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager', 'Staff']::app_role[]));

-- Clients, Projects, Proposals: Read for all studio roles, Write for Super Admin / Admin / Manager
CREATE POLICY "Studio roles read clients"
  ON public.clients FOR SELECT TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager', 'Staff']::app_role[]));

CREATE POLICY "Studio managers write clients"
  ON public.clients FOR ALL TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager']::app_role[]));

CREATE POLICY "Studio roles read projects"
  ON public.projects FOR SELECT TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager', 'Staff']::app_role[]));

CREATE POLICY "Studio managers write projects"
  ON public.projects FOR ALL TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager']::app_role[]));

-- Finance (Invoices & Payments): Restricted to Super Admin, Admin, and Manager
CREATE POLICY "Finance read access"
  ON public.invoices FOR SELECT TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager']::app_role[]));

CREATE POLICY "Finance write access"
  ON public.invoices FOR ALL TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin']::app_role[]));

CREATE POLICY "Payments read access"
  ON public.payments FOR SELECT TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager']::app_role[]));

CREATE POLICY "Payments write access"
  ON public.payments FOR ALL TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin']::app_role[]));

-- User Roles & Security Settings: Super Admin only for mutations
CREATE POLICY "Super Admin manages user_roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin']::app_role[]));

-- Activity Logs: Append-only for studio members, read for Super Admin & Admin
CREATE POLICY "Studio members insert activity logs"
  ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_studio_role(ARRAY['Super Admin', 'Admin', 'Manager', 'Staff']::app_role[]));

CREATE POLICY "Admins read activity logs"
  ON public.activity_logs FOR SELECT TO authenticated
  USING (public.has_studio_role(ARRAY['Super Admin', 'Admin']::app_role[]));
