-- ============================================
-- AGENT TEMPLATES TABLE (Admin-owned templates)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type public.agent_type NOT NULL,
    -- Template constraints that downstream roles cannot modify
    allowed_task_categories TEXT[] NOT NULL DEFAULT '{}',
    data_access_scope JSONB NOT NULL DEFAULT '{"level": "restricted", "departments": []}'::jsonb,
    max_concurrent_tasks INTEGER NOT NULL DEFAULT 5,
    permissions JSONB NOT NULL DEFAULT '{"can_read": true, "can_write": false, "can_delete": false}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- UPDATE AGENTS TABLE to link to templates
-- ============================================
ALTER TABLE public.agents 
    ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.agent_templates(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS objectives JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS constraints JSONB DEFAULT '{}'::jsonb;

-- ============================================
-- TASK ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    result JSONB,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS for new roles
-- ============================================

-- Check if user is operational
CREATE OR REPLACE FUNCTION public.is_operational(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'operational')
$$;

-- Check if user is executive
CREATE OR REPLACE FUNCTION public.is_executive(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'executive')
$$;

-- Check if user can manage templates (admin only)
CREATE OR REPLACE FUNCTION public.can_manage_templates(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id)
$$;

-- Check if user can create agents from templates (admin or ciso)
CREATE OR REPLACE FUNCTION public.can_create_agents(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) OR public.is_ciso(_user_id)
$$;

-- Check if user can assign agents/tasks (admin or ciso)
CREATE OR REPLACE FUNCTION public.can_assign_tasks(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) OR public.is_ciso(_user_id)
$$;

-- Check if user can view operational data
CREATE OR REPLACE FUNCTION public.can_view_operations(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) OR public.is_ciso(_user_id) OR public.is_operational(_user_id)
$$;

-- Check if user can view executive dashboards
CREATE OR REPLACE FUNCTION public.can_view_executive_data(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(_user_id) OR public.is_executive(_user_id)
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamps for agent_templates
CREATE TRIGGER update_agent_templates_updated_at
    BEFORE UPDATE ON public.agent_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps for task_assignments
CREATE TRIGGER update_task_assignments_updated_at
    BEFORE UPDATE ON public.task_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_agents_template_id ON public.agents(template_id);
CREATE INDEX IF NOT EXISTS idx_agents_assigned_to ON public.agents(assigned_to);
CREATE INDEX IF NOT EXISTS idx_task_assignments_agent_id ON public.task_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_assigned_to ON public.task_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);