-- ============================================================
-- CyberX Complete Database Schema
-- Run this on a fresh Supabase project
-- ============================================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'ciso', 'soc', 'auditor', 'operational', 'executive');
CREATE TYPE public.agent_status AS ENUM ('active', 'inactive', 'pending', 'error');
CREATE TYPE public.agent_type AS ENUM ('vcompliance', 'vaudit', 'vrisk', 'vgovernance');

-- 2. TABLES

-- Organizations
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  organization_type text,
  country text,
  risk_appetite_level text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Roles (reference table)
CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  department text,
  role_title text,
  status text DEFAULT 'active',
  language text DEFAULT 'en',
  theme text DEFAULT 'dark',
  organization_id uuid REFERENCES public.organizations(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Assets
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_name text NOT NULL,
  asset_type text,
  criticality_level text,
  data_classification text,
  organization_id uuid REFERENCES public.organizations(id),
  owner_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Risks
CREATE TABLE public.risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_title text NOT NULL,
  description text,
  threat_description text,
  vulnerability_description text,
  likelihood text,
  likelihood_score numeric,
  impact text,
  impact_score numeric,
  risk_score numeric,
  status text DEFAULT 'Open',
  risk_owner_user_id uuid,
  asset_id uuid REFERENCES public.assets(id),
  organization_id uuid REFERENCES public.organizations(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Risk Treatments
CREATE TABLE public.risk_treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id uuid NOT NULL REFERENCES public.risks(id),
  treatment_type text NOT NULL,
  action_description text,
  status text DEFAULT 'Planned',
  target_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Controls
CREATE TABLE public.controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_code text,
  control_name text NOT NULL,
  description text,
  control_type text,
  control_status text DEFAULT 'Planned',
  framework text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Risk Controls (junction)
CREATE TABLE public.risk_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id uuid NOT NULL REFERENCES public.risks(id),
  control_id uuid NOT NULL REFERENCES public.controls(id)
);

-- Asset Controls (junction)
CREATE TABLE public.asset_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.assets(id),
  control_id uuid NOT NULL REFERENCES public.controls(id)
);

-- Compliance Frameworks
CREATE TABLE public.compliance_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_name text NOT NULL,
  version text,
  regulator_body text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Framework Controls (junction)
CREATE TABLE public.framework_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id uuid NOT NULL REFERENCES public.compliance_frameworks(id),
  control_id uuid NOT NULL REFERENCES public.controls(id)
);

-- Compliance Assessments
CREATE TABLE public.compliance_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id),
  framework_id uuid REFERENCES public.compliance_frameworks(id),
  assessment_date timestamptz DEFAULT now(),
  assessment_status text DEFAULT 'Planned',
  overall_score numeric,
  assessor_user_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Audit Findings
CREATE TABLE public.audit_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES public.compliance_assessments(id),
  control_id uuid REFERENCES public.controls(id),
  finding_description text NOT NULL,
  severity text,
  remediation_status text DEFAULT 'Open',
  remediation_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Compliance Status
CREATE TABLE public.compliance_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id uuid NOT NULL REFERENCES public.controls(id),
  status text DEFAULT 'Non_Compliant',
  last_checked timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Evidence
CREATE TABLE public.evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  evidence_type text,
  file_url text,
  storage_location text,
  control_id uuid REFERENCES public.controls(id),
  uploaded_by uuid,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Policies
CREATE TABLE public.policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name text NOT NULL,
  policy_type text,
  content text,
  version text DEFAULT '1.0',
  approval_status text DEFAULT 'Draft',
  effective_date timestamptz,
  created_by uuid,
  approved_by_user_id uuid,
  organization_id uuid REFERENCES public.organizations(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Incidents
CREATE TABLE public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  severity text,
  status text DEFAULT 'Active',
  detected_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  assigned_to uuid,
  risk_id uuid REFERENCES public.risks(id),
  organization_id uuid REFERENCES public.organizations(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Alerts (with Realtime)
CREATE TABLE public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary text NOT NULL,
  severity text,
  status text DEFAULT 'New',
  source text,
  incident_id uuid REFERENCES public.incidents(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- AI Agent Status
CREATE TABLE public.ai_agent_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  status text DEFAULT 'Idle',
  confidence numeric,
  recommendation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Advisors
CREATE TABLE public.advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  role_template text,
  model_ref text,
  status text DEFAULT 'Active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Chats
CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  message text,
  response text,
  conversation_type text,
  advisor_ids jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Agent Templates
CREATE TABLE public.agent_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type agent_type NOT NULL,
  allowed_task_categories text[] NOT NULL DEFAULT '{}',
  data_access_scope jsonb NOT NULL DEFAULT '{"level": "restricted", "departments": []}'::jsonb,
  max_concurrent_tasks integer NOT NULL DEFAULT 5,
  permissions jsonb NOT NULL DEFAULT '{"can_read": true, "can_write": false, "can_delete": false}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Agents
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type agent_type NOT NULL,
  status agent_status NOT NULL DEFAULT 'inactive',
  config jsonb DEFAULT '{}'::jsonb,
  objectives jsonb DEFAULT '[]'::jsonb,
  constraints jsonb DEFAULT '{}'::jsonb,
  template_id uuid REFERENCES public.agent_templates(id),
  assigned_to uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Task Assignments
CREATE TABLE public.task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  priority text NOT NULL DEFAULT 'medium',
  result jsonb,
  due_date timestamptz,
  completed_at timestamptz,
  agent_id uuid NOT NULL REFERENCES public.agents(id),
  assigned_to uuid NOT NULL,
  assigned_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. FUNCTIONS

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_ciso(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'ciso')
$$;

CREATE OR REPLACE FUNCTION public.is_manager(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'ciso')
$$;

CREATE OR REPLACE FUNCTION public.is_operational(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'operational')
$$;

CREATE OR REPLACE FUNCTION public.is_executive(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'executive')
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.can_view_executive_data(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id) OR public.is_executive(_user_id)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_templates(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id)
$$;

CREATE OR REPLACE FUNCTION public.can_create_agents(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id) OR public.is_ciso(_user_id)
$$;

CREATE OR REPLACE FUNCTION public.can_assign_tasks(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id) OR public.is_ciso(_user_id)
$$;

CREATE OR REPLACE FUNCTION public.can_view_operations(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin(_user_id) OR public.is_ciso(_user_id) OR public.is_operational(_user_id)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

-- 4. TRIGGERS

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risk_treatments_updated_at BEFORE UPDATE ON public.risk_treatments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON public.controls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_assessments_updated_at BEFORE UPDATE ON public.compliance_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_audit_findings_updated_at BEFORE UPDATE ON public.audit_findings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_status_updated_at BEFORE UPDATE ON public.compliance_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_agent_status_updated_at BEFORE UPDATE ON public.ai_agent_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_advisors_updated_at BEFORE UPDATE ON public.advisors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agent_templates_updated_at BEFORE UPDATE ON public.agent_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_task_assignments_updated_at BEFORE UPDATE ON public.task_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auth trigger for new user profile creation
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. ENABLE RLS ON ALL TABLES

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.framework_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Organizations
CREATE POLICY "Authenticated users can view organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Admin can manage organizations" ON public.organizations FOR ALL USING (is_admin(auth.uid()));

-- Roles
CREATE POLICY "Anyone can view roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Admin can manage roles" ON public.roles FOR ALL USING (is_admin(auth.uid()));

-- User Roles
CREATE POLICY "Role visibility policy" ON public.user_roles FOR SELECT USING ((user_id = auth.uid()) OR is_admin(auth.uid()));
CREATE POLICY "Admin can insert roles" ON public.user_roles FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin can update roles" ON public.user_roles FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admin can delete roles" ON public.user_roles FOR DELETE USING (is_admin(auth.uid()));

-- Profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admin can update any profile" ON public.profiles FOR UPDATE USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admin can delete any profile" ON public.profiles FOR DELETE USING (is_admin(auth.uid()));

-- Assets
CREATE POLICY "Authenticated can view assets" ON public.assets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage assets" ON public.assets FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update assets" ON public.assets FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete assets" ON public.assets FOR DELETE USING (is_admin(auth.uid()));

-- Risks
CREATE POLICY "Authenticated can view risks" ON public.risks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage risks" ON public.risks FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update risks" ON public.risks FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete risks" ON public.risks FOR DELETE USING (is_admin(auth.uid()));

-- Risk Treatments
CREATE POLICY "Authenticated can view treatments" ON public.risk_treatments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage treatments" ON public.risk_treatments FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update treatments" ON public.risk_treatments FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete treatments" ON public.risk_treatments FOR DELETE USING (is_admin(auth.uid()));

-- Controls
CREATE POLICY "Authenticated can view controls" ON public.controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage controls" ON public.controls FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update controls" ON public.controls FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete controls" ON public.controls FOR DELETE USING (is_admin(auth.uid()));

-- Risk Controls
CREATE POLICY "Authenticated can view risk_controls" ON public.risk_controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage risk_controls" ON public.risk_controls FOR ALL USING (is_manager(auth.uid()));

-- Asset Controls
CREATE POLICY "Authenticated can view asset_controls" ON public.asset_controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage asset_controls" ON public.asset_controls FOR ALL USING (is_manager(auth.uid()));

-- Compliance Frameworks
CREATE POLICY "Authenticated can view frameworks" ON public.compliance_frameworks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage frameworks" ON public.compliance_frameworks FOR ALL USING (is_admin(auth.uid()));

-- Framework Controls
CREATE POLICY "Authenticated can view framework_controls" ON public.framework_controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage framework_controls" ON public.framework_controls FOR ALL USING (is_manager(auth.uid()));

-- Compliance Assessments
CREATE POLICY "Authenticated can view assessments" ON public.compliance_assessments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage assessments" ON public.compliance_assessments FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update assessments" ON public.compliance_assessments FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete assessments" ON public.compliance_assessments FOR DELETE USING (is_admin(auth.uid()));

-- Audit Findings
CREATE POLICY "Authenticated can view findings" ON public.audit_findings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage findings" ON public.audit_findings FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update findings" ON public.audit_findings FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete findings" ON public.audit_findings FOR DELETE USING (is_admin(auth.uid()));

-- Compliance Status
CREATE POLICY "Authenticated can view compliance_status" ON public.compliance_status FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage compliance_status" ON public.compliance_status FOR ALL USING (is_manager(auth.uid()));

-- Evidence
CREATE POLICY "Authenticated can view evidence" ON public.evidence FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage evidence" ON public.evidence FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update evidence" ON public.evidence FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete evidence" ON public.evidence FOR DELETE USING (is_admin(auth.uid()));

-- Policies
CREATE POLICY "Authenticated can view policies" ON public.policies FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage policies" ON public.policies FOR INSERT WITH CHECK (is_manager(auth.uid()));
CREATE POLICY "Manager can update policies" ON public.policies FOR UPDATE USING (is_manager(auth.uid()));
CREATE POLICY "Admin can delete policies" ON public.policies FOR DELETE USING (is_admin(auth.uid()));

-- Incidents
CREATE POLICY "Operations can view incidents" ON public.incidents FOR SELECT USING (can_view_operations(auth.uid()));
CREATE POLICY "Operations can create incidents" ON public.incidents FOR INSERT WITH CHECK (can_view_operations(auth.uid()));
CREATE POLICY "Operations can update incidents" ON public.incidents FOR UPDATE USING (can_view_operations(auth.uid()));
CREATE POLICY "Admin can delete incidents" ON public.incidents FOR DELETE USING (is_admin(auth.uid()));

-- Alerts
CREATE POLICY "Operations can view alerts" ON public.alerts FOR SELECT USING (can_view_operations(auth.uid()));
CREATE POLICY "Operations can create alerts" ON public.alerts FOR INSERT WITH CHECK (can_view_operations(auth.uid()));
CREATE POLICY "Operations can update alerts" ON public.alerts FOR UPDATE USING (can_view_operations(auth.uid()));
CREATE POLICY "Admin can delete alerts" ON public.alerts FOR DELETE USING (is_admin(auth.uid()));

-- Audit Logs
CREATE POLICY "Admin can view all audit logs" ON public.audit_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can view own audit logs" ON public.audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "CISO can view operational audit logs" ON public.audit_logs FOR SELECT USING (is_ciso(auth.uid()) AND resource_type = ANY(ARRAY['agent','task','operation']));
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- AI Agent Status
CREATE POLICY "Authenticated can view ai_agent_status" ON public.ai_agent_status FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage ai_agent_status" ON public.ai_agent_status FOR ALL USING (is_admin(auth.uid()));

-- Advisors
CREATE POLICY "Authenticated can view advisors" ON public.advisors FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage advisors" ON public.advisors FOR ALL USING (is_admin(auth.uid()));

-- Chats
CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin can view all chats" ON public.chats FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Users can create own chats" ON public.chats FOR INSERT WITH CHECK (user_id = auth.uid());

-- Agent Templates
CREATE POLICY "Authenticated users can view active templates" ON public.agent_templates FOR SELECT USING ((is_active = true) OR is_admin(auth.uid()));
CREATE POLICY "Only admin can create templates" ON public.agent_templates FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admin can update templates" ON public.agent_templates FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Only admin can delete templates" ON public.agent_templates FOR DELETE USING (is_admin(auth.uid()));

-- Agents
CREATE POLICY "Role-based agent visibility" ON public.agents FOR SELECT USING (is_admin(auth.uid()) OR is_ciso(auth.uid()) OR is_executive(auth.uid()) OR (is_operational(auth.uid()) AND assigned_to = auth.uid()));
CREATE POLICY "Admin and CISO can create agents" ON public.agents FOR INSERT WITH CHECK (can_create_agents(auth.uid()));
CREATE POLICY "Admin and CISO can update agents" ON public.agents FOR UPDATE USING (can_create_agents(auth.uid()));
CREATE POLICY "Only admin can delete agents" ON public.agents FOR DELETE USING (is_admin(auth.uid()));

-- Task Assignments
CREATE POLICY "Role-based task visibility" ON public.task_assignments FOR SELECT USING (is_admin(auth.uid()) OR is_ciso(auth.uid()) OR assigned_to = auth.uid());
CREATE POLICY "Managers can create task assignments" ON public.task_assignments FOR INSERT WITH CHECK (can_assign_tasks(auth.uid()));
CREATE POLICY "Task update policy" ON public.task_assignments FOR UPDATE USING (can_assign_tasks(auth.uid()) OR (assigned_to = auth.uid() AND is_operational(auth.uid())));
CREATE POLICY "Only managers can delete tasks" ON public.task_assignments FOR DELETE USING (can_assign_tasks(auth.uid()));

-- 7. ENABLE REALTIME FOR ALERTS
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- 8. SEED DEFAULT ROLES
INSERT INTO public.roles (role_name, description) VALUES
  ('admin', 'Full system access'),
  ('ciso', 'Chief Information Security Officer'),
  ('soc', 'Security Operations Center'),
  ('auditor', 'Compliance Auditor'),
  ('operational', 'Operational Staff'),
  ('executive', 'Executive Leadership');
