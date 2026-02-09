
-- =============================================
-- CyberX ERD Full Database Schema Migration
-- =============================================

-- 1. Organizations (Root tenant entity)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  organization_type TEXT CHECK (organization_type IN ('Government', 'Enterprise', 'SME')),
  country TEXT,
  risk_appetite_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Admin can manage organizations" ON public.organizations FOR ALL USING (public.is_admin(auth.uid()));

-- Add columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';

-- 2. Roles definition table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Admin can manage roles" ON public.roles FOR ALL USING (public.is_admin(auth.uid()));

INSERT INTO public.roles (role_name, description) VALUES
  ('admin', 'System configuration, user/template management'),
  ('ciso', 'Strategic oversight, operational management'),
  ('soc', 'Security operations center analyst'),
  ('auditor', 'Compliance assessment and control reviews'),
  ('operational', 'Incident interaction and task execution'),
  ('executive', 'Strategic dashboards and risk reporting');

-- 3. Assets
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  asset_name TEXT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('Application', 'Server', 'Cloud', 'Data', 'Network', 'Other')),
  criticality_level TEXT CHECK (criticality_level IN ('Critical', 'High', 'Medium', 'Low')),
  data_classification TEXT,
  owner_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view assets" ON public.assets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage assets" ON public.assets FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update assets" ON public.assets FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete assets" ON public.assets FOR DELETE USING (public.is_admin(auth.uid()));

-- 4. Policies
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  policy_name TEXT NOT NULL,
  policy_type TEXT CHECK (policy_type IN ('Security', 'Access Control', 'Privacy', 'Compliance', 'Other')),
  content TEXT,
  version TEXT DEFAULT '1.0',
  approval_status TEXT CHECK (approval_status IN ('Draft', 'Pending', 'Approved', 'Rejected', 'Archived')) DEFAULT 'Draft',
  approved_by_user_id UUID,
  effective_date TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view policies" ON public.policies FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage policies" ON public.policies FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update policies" ON public.policies FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete policies" ON public.policies FOR DELETE USING (public.is_admin(auth.uid()));

-- 5. Risks
CREATE TABLE public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  asset_id UUID REFERENCES public.assets(id),
  risk_owner_user_id UUID,
  risk_title TEXT NOT NULL,
  description TEXT,
  threat_description TEXT,
  vulnerability_description TEXT,
  likelihood_score NUMERIC CHECK (likelihood_score >= 0 AND likelihood_score <= 100),
  impact_score NUMERIC CHECK (impact_score >= 0 AND impact_score <= 100),
  risk_score NUMERIC GENERATED ALWAYS AS (COALESCE(likelihood_score, 0) * COALESCE(impact_score, 0) / 100) STORED,
  impact TEXT CHECK (impact IN ('Critical', 'High', 'Medium', 'Low')),
  likelihood TEXT CHECK (likelihood IN ('Very High', 'High', 'Medium', 'Low', 'Very Low')),
  status TEXT CHECK (status IN ('Open', 'Mitigated', 'Closed', 'Accepted', 'Transferred')) DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view risks" ON public.risks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage risks" ON public.risks FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update risks" ON public.risks FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete risks" ON public.risks FOR DELETE USING (public.is_admin(auth.uid()));

-- 6. Risk Treatments
CREATE TABLE public.risk_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID NOT NULL REFERENCES public.risks(id) ON DELETE CASCADE,
  treatment_type TEXT CHECK (treatment_type IN ('Mitigate', 'Accept', 'Transfer', 'Avoid')) NOT NULL,
  action_description TEXT,
  target_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Overdue')) DEFAULT 'Planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.risk_treatments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view treatments" ON public.risk_treatments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage treatments" ON public.risk_treatments FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update treatments" ON public.risk_treatments FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete treatments" ON public.risk_treatments FOR DELETE USING (public.is_admin(auth.uid()));

-- 7. Controls
CREATE TABLE public.controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_code TEXT,
  control_name TEXT NOT NULL,
  description TEXT,
  control_type TEXT CHECK (control_type IN ('Technical', 'Administrative', 'Physical')),
  control_status TEXT CHECK (control_status IN ('Implemented', 'Partial', 'Not Implemented', 'Planned')) DEFAULT 'Planned',
  framework TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view controls" ON public.controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage controls" ON public.controls FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update controls" ON public.controls FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete controls" ON public.controls FOR DELETE USING (public.is_admin(auth.uid()));

-- 8. Risk-Control Junction
CREATE TABLE public.risk_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID NOT NULL REFERENCES public.risks(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES public.controls(id) ON DELETE CASCADE,
  UNIQUE(risk_id, control_id)
);

ALTER TABLE public.risk_controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view risk_controls" ON public.risk_controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage risk_controls" ON public.risk_controls FOR ALL USING (public.is_manager(auth.uid()));

-- 9. Asset-Control Junction
CREATE TABLE public.asset_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES public.controls(id) ON DELETE CASCADE,
  UNIQUE(asset_id, control_id)
);

ALTER TABLE public.asset_controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view asset_controls" ON public.asset_controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage asset_controls" ON public.asset_controls FOR ALL USING (public.is_manager(auth.uid()));

-- 10. Compliance Frameworks
CREATE TABLE public.compliance_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_name TEXT NOT NULL,
  version TEXT,
  regulator_body TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view frameworks" ON public.compliance_frameworks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage frameworks" ON public.compliance_frameworks FOR ALL USING (public.is_admin(auth.uid()));

-- 11. Framework-Control Junction
CREATE TABLE public.framework_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES public.controls(id) ON DELETE CASCADE,
  UNIQUE(framework_id, control_id)
);

ALTER TABLE public.framework_controls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view framework_controls" ON public.framework_controls FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage framework_controls" ON public.framework_controls FOR ALL USING (public.is_manager(auth.uid()));

-- 12. Compliance Assessments
CREATE TABLE public.compliance_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  framework_id UUID REFERENCES public.compliance_frameworks(id),
  assessment_date TIMESTAMPTZ DEFAULT now(),
  overall_score NUMERIC,
  assessment_status TEXT CHECK (assessment_status IN ('Planned', 'In Progress', 'Completed', 'Reviewed')) DEFAULT 'Planned',
  assessor_user_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view assessments" ON public.compliance_assessments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage assessments" ON public.compliance_assessments FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update assessments" ON public.compliance_assessments FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete assessments" ON public.compliance_assessments FOR DELETE USING (public.is_admin(auth.uid()));

-- 13. Compliance Status
CREATE TABLE public.compliance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id UUID NOT NULL REFERENCES public.controls(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Compliant', 'Partially_Compliant', 'Non_Compliant')) DEFAULT 'Non_Compliant',
  last_checked TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view compliance_status" ON public.compliance_status FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage compliance_status" ON public.compliance_status FOR ALL USING (public.is_manager(auth.uid()));

-- 14. Audit Findings
CREATE TABLE public.audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.compliance_assessments(id) ON DELETE CASCADE,
  control_id UUID REFERENCES public.controls(id),
  finding_description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Critical', 'High', 'Medium', 'Low', 'Info')),
  remediation_status TEXT CHECK (remediation_status IN ('Open', 'In Progress', 'Resolved', 'Accepted')) DEFAULT 'Open',
  remediation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view findings" ON public.audit_findings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage findings" ON public.audit_findings FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update findings" ON public.audit_findings FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete findings" ON public.audit_findings FOR DELETE USING (public.is_admin(auth.uid()));

-- 15. Incidents
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT CHECK (status IN ('Active', 'Investigating', 'Contained', 'Resolved', 'Closed')) DEFAULT 'Active',
  detected_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  assigned_to UUID,
  risk_id UUID REFERENCES public.risks(id),
  organization_id UUID REFERENCES public.organizations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operations can view incidents" ON public.incidents FOR SELECT USING (public.can_view_operations(auth.uid()));
CREATE POLICY "Operations can create incidents" ON public.incidents FOR INSERT WITH CHECK (public.can_view_operations(auth.uid()));
CREATE POLICY "Operations can update incidents" ON public.incidents FOR UPDATE USING (public.can_view_operations(auth.uid()));
CREATE POLICY "Admin can delete incidents" ON public.incidents FOR DELETE USING (public.is_admin(auth.uid()));

-- 16. Alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT CHECK (status IN ('New', 'Acknowledged', 'Investigating', 'Resolved')) DEFAULT 'New',
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Operations can view alerts" ON public.alerts FOR SELECT USING (public.can_view_operations(auth.uid()));
CREATE POLICY "Operations can create alerts" ON public.alerts FOR INSERT WITH CHECK (public.can_view_operations(auth.uid()));
CREATE POLICY "Operations can update alerts" ON public.alerts FOR UPDATE USING (public.can_view_operations(auth.uid()));
CREATE POLICY "Admin can delete alerts" ON public.alerts FOR DELETE USING (public.is_admin(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;

-- 17. AI Agent Monitoring Status (renamed to avoid conflict with agent_status enum)
CREATE TABLE public.ai_agent_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('Monitoring', 'Responding', 'Idle', 'Error')) DEFAULT 'Idle',
  confidence NUMERIC,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_agent_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view ai_agent_status" ON public.ai_agent_status FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage ai_agent_status" ON public.ai_agent_status FOR ALL USING (public.is_admin(auth.uid()));

-- 18. Evidence
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  evidence_type TEXT,
  control_id UUID REFERENCES public.controls(id),
  uploaded_by UUID,
  storage_location TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view evidence" ON public.evidence FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Manager can manage evidence" ON public.evidence FOR INSERT WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "Manager can update evidence" ON public.evidence FOR UPDATE USING (public.is_manager(auth.uid()));
CREATE POLICY "Admin can delete evidence" ON public.evidence FOR DELETE USING (public.is_admin(auth.uid()));

-- 19. Advisors (AI personas)
CREATE TABLE public.advisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_template TEXT,
  model_ref TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view advisors" ON public.advisors FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage advisors" ON public.advisors FOR ALL USING (public.is_admin(auth.uid()));

-- 20. Chats (Agent Conversations)
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  advisor_ids JSONB DEFAULT '[]',
  conversation_type TEXT,
  message TEXT,
  response TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own chats" ON public.chats FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin can view all chats" ON public.chats FOR SELECT USING (public.is_admin(auth.uid()));

-- Timestamp update triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risk_treatments_updated_at BEFORE UPDATE ON public.risk_treatments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON public.controls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_assessments_updated_at BEFORE UPDATE ON public.compliance_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_status_updated_at BEFORE UPDATE ON public.compliance_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_audit_findings_updated_at BEFORE UPDATE ON public.audit_findings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_agent_status_updated_at BEFORE UPDATE ON public.ai_agent_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_advisors_updated_at BEFORE UPDATE ON public.advisors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
