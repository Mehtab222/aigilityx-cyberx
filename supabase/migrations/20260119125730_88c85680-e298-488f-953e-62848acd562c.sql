-- ============================================
-- AGENT TEMPLATES RLS POLICIES
-- ============================================

-- Everyone authenticated can view active templates
CREATE POLICY "Authenticated users can view active templates"
ON public.agent_templates
FOR SELECT
TO authenticated
USING (is_active = true OR public.is_admin(auth.uid()));

-- Only admin can create templates
CREATE POLICY "Only admin can create templates"
ON public.agent_templates
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Only admin can update templates
CREATE POLICY "Only admin can update templates"
ON public.agent_templates
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admin can delete templates
CREATE POLICY "Only admin can delete templates"
ON public.agent_templates
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ============================================
-- AGENTS RLS POLICIES (Drop old, create new)
-- ============================================
DROP POLICY IF EXISTS "All authenticated users can view agents" ON public.agents;
DROP POLICY IF EXISTS "Only managers can create agents" ON public.agents;
DROP POLICY IF EXISTS "Only managers can delete agents" ON public.agents;
DROP POLICY IF EXISTS "Only managers can update agents" ON public.agents;

-- Viewing: Admin/CISO see all, Operational see assigned, Executive see all (read-only)
CREATE POLICY "Role-based agent visibility"
ON public.agents
FOR SELECT
TO authenticated
USING (
    public.is_admin(auth.uid()) OR 
    public.is_ciso(auth.uid()) OR 
    public.is_executive(auth.uid()) OR
    (public.is_operational(auth.uid()) AND assigned_to = auth.uid())
);

-- Creating: Only admin and CISO can create agents
CREATE POLICY "Admin and CISO can create agents"
ON public.agents
FOR INSERT
TO authenticated
WITH CHECK (public.can_create_agents(auth.uid()));

-- Updating: Admin and CISO can update agents
CREATE POLICY "Admin and CISO can update agents"
ON public.agents
FOR UPDATE
TO authenticated
USING (public.can_create_agents(auth.uid()));

-- Deleting: Only admin can delete agents
CREATE POLICY "Only admin can delete agents"
ON public.agents
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ============================================
-- TASK ASSIGNMENTS RLS POLICIES
-- ============================================

-- Viewing: Users see tasks assigned to them, managers see all
CREATE POLICY "Role-based task visibility"
ON public.task_assignments
FOR SELECT
TO authenticated
USING (
    public.is_admin(auth.uid()) OR 
    public.is_ciso(auth.uid()) OR 
    assigned_to = auth.uid()
);

-- Creating: Only admin and CISO can create task assignments
CREATE POLICY "Managers can create task assignments"
ON public.task_assignments
FOR INSERT
TO authenticated
WITH CHECK (public.can_assign_tasks(auth.uid()));

-- Updating: Managers can update any, operational can update their own status/result
CREATE POLICY "Task update policy"
ON public.task_assignments
FOR UPDATE
TO authenticated
USING (
    public.can_assign_tasks(auth.uid()) OR 
    (assigned_to = auth.uid() AND public.is_operational(auth.uid()))
);

-- Deleting: Only managers can delete
CREATE POLICY "Only managers can delete tasks"
ON public.task_assignments
FOR DELETE
TO authenticated
USING (public.can_assign_tasks(auth.uid()));

-- ============================================
-- AUDIT LOGS RLS POLICIES
-- ============================================

-- Admin can view all audit logs
CREATE POLICY "Admin can view all audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- CISO can view operational audit logs
CREATE POLICY "CISO can view operational audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
    public.is_ciso(auth.uid()) AND 
    resource_type IN ('agent', 'task', 'operation')
);

-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Authenticated users can insert audit logs for themselves
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================
-- USER ROLES RLS POLICIES (Drop old, create new)
-- ============================================
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Users can view their own role, admin can view all
CREATE POLICY "Role visibility policy"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Only admin can manage roles
CREATE POLICY "Admin can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));