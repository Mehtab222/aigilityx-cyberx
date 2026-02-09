export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advisors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          model_ref: string | null
          name: string
          role_template: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          model_ref?: string | null
          name: string
          role_template?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          model_ref?: string | null
          name?: string
          role_template?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      agent_templates: {
        Row: {
          allowed_task_categories: string[]
          created_at: string
          created_by: string | null
          data_access_scope: Json
          description: string | null
          id: string
          is_active: boolean
          max_concurrent_tasks: number
          name: string
          permissions: Json
          type: Database["public"]["Enums"]["agent_type"]
          updated_at: string
        }
        Insert: {
          allowed_task_categories?: string[]
          created_at?: string
          created_by?: string | null
          data_access_scope?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          max_concurrent_tasks?: number
          name: string
          permissions?: Json
          type: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Update: {
          allowed_task_categories?: string[]
          created_at?: string
          created_by?: string | null
          data_access_scope?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          max_concurrent_tasks?: number
          name?: string
          permissions?: Json
          type?: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          assigned_to: string | null
          config: Json | null
          constraints: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          objectives: Json | null
          status: Database["public"]["Enums"]["agent_status"]
          template_id: string | null
          type: Database["public"]["Enums"]["agent_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          config?: Json | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          objectives?: Json | null
          status?: Database["public"]["Enums"]["agent_status"]
          template_id?: string | null
          type: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          config?: Json | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          objectives?: Json | null
          status?: Database["public"]["Enums"]["agent_status"]
          template_id?: string | null
          type?: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "agent_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agent_status: {
        Row: {
          agent_name: string
          confidence: number | null
          created_at: string
          id: string
          recommendation: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          agent_name: string
          confidence?: number | null
          created_at?: string
          id?: string
          recommendation?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          agent_name?: string
          confidence?: number | null
          created_at?: string
          id?: string
          recommendation?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          created_at: string
          id: string
          incident_id: string | null
          severity: string | null
          source: string | null
          status: string | null
          summary: string
        }
        Insert: {
          created_at?: string
          id?: string
          incident_id?: string | null
          severity?: string | null
          source?: string | null
          status?: string | null
          summary: string
        }
        Update: {
          created_at?: string
          id?: string
          incident_id?: string | null
          severity?: string | null
          source?: string | null
          status?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_controls: {
        Row: {
          asset_id: string
          control_id: string
          id: string
        }
        Insert: {
          asset_id: string
          control_id: string
          id?: string
        }
        Update: {
          asset_id?: string
          control_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_controls_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_controls_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_name: string
          asset_type: string | null
          created_at: string
          criticality_level: string | null
          data_classification: string | null
          id: string
          organization_id: string | null
          owner_user_id: string | null
          updated_at: string
        }
        Insert: {
          asset_name: string
          asset_type?: string | null
          created_at?: string
          criticality_level?: string | null
          data_classification?: string | null
          id?: string
          organization_id?: string | null
          owner_user_id?: string | null
          updated_at?: string
        }
        Update: {
          asset_name?: string
          asset_type?: string | null
          created_at?: string
          criticality_level?: string | null
          data_classification?: string | null
          id?: string
          organization_id?: string | null
          owner_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          assessment_id: string | null
          control_id: string | null
          created_at: string
          finding_description: string
          id: string
          remediation_notes: string | null
          remediation_status: string | null
          severity: string | null
          updated_at: string
        }
        Insert: {
          assessment_id?: string | null
          control_id?: string | null
          created_at?: string
          finding_description: string
          id?: string
          remediation_notes?: string | null
          remediation_status?: string | null
          severity?: string | null
          updated_at?: string
        }
        Update: {
          assessment_id?: string | null
          control_id?: string | null
          created_at?: string
          finding_description?: string
          id?: string
          remediation_notes?: string | null
          remediation_status?: string | null
          severity?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "compliance_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_findings_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          advisor_ids: Json | null
          conversation_type: string | null
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          response: string | null
          user_id: string
        }
        Insert: {
          advisor_ids?: Json | null
          conversation_type?: string | null
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          response?: string | null
          user_id: string
        }
        Update: {
          advisor_ids?: Json | null
          conversation_type?: string | null
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      compliance_assessments: {
        Row: {
          assessment_date: string | null
          assessment_status: string | null
          assessor_user_id: string | null
          created_at: string
          framework_id: string | null
          id: string
          notes: string | null
          organization_id: string | null
          overall_score: number | null
          updated_at: string
        }
        Insert: {
          assessment_date?: string | null
          assessment_status?: string | null
          assessor_user_id?: string | null
          created_at?: string
          framework_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          overall_score?: number | null
          updated_at?: string
        }
        Update: {
          assessment_date?: string | null
          assessment_status?: string | null
          assessor_user_id?: string | null
          created_at?: string
          framework_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          overall_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_assessments_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_frameworks: {
        Row: {
          created_at: string
          description: string | null
          framework_name: string
          id: string
          regulator_body: string | null
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          framework_name: string
          id?: string
          regulator_body?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          framework_name?: string
          id?: string
          regulator_body?: string | null
          version?: string | null
        }
        Relationships: []
      }
      compliance_status: {
        Row: {
          control_id: string
          created_at: string
          id: string
          last_checked: string | null
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          control_id: string
          created_at?: string
          id?: string
          last_checked?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          control_id?: string
          created_at?: string
          id?: string
          last_checked?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_status_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
        ]
      }
      controls: {
        Row: {
          control_code: string | null
          control_name: string
          control_status: string | null
          control_type: string | null
          created_at: string
          description: string | null
          framework: string | null
          id: string
          updated_at: string
        }
        Insert: {
          control_code?: string | null
          control_name: string
          control_status?: string | null
          control_type?: string | null
          created_at?: string
          description?: string | null
          framework?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          control_code?: string | null
          control_name?: string
          control_status?: string | null
          control_type?: string | null
          created_at?: string
          description?: string | null
          framework?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          control_id: string | null
          created_at: string
          description: string | null
          evidence_type: string | null
          file_url: string | null
          id: string
          name: string
          storage_location: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          control_id?: string | null
          created_at?: string
          description?: string | null
          evidence_type?: string | null
          file_url?: string | null
          id?: string
          name: string
          storage_location?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          control_id?: string | null
          created_at?: string
          description?: string | null
          evidence_type?: string | null
          file_url?: string | null
          id?: string
          name?: string
          storage_location?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
        ]
      }
      framework_controls: {
        Row: {
          control_id: string
          framework_id: string
          id: string
        }
        Insert: {
          control_id: string
          framework_id: string
          id?: string
        }
        Update: {
          control_id?: string
          framework_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "framework_controls_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "framework_controls_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          detected_at: string | null
          id: string
          organization_id: string | null
          resolved_at: string | null
          risk_id: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          detected_at?: string | null
          id?: string
          organization_id?: string | null
          resolved_at?: string | null
          risk_id?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          detected_at?: string | null
          id?: string
          organization_id?: string | null
          resolved_at?: string | null
          risk_id?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "risks"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          organization_type: string | null
          risk_appetite_level: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          organization_type?: string | null
          risk_appetite_level?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          organization_type?: string | null
          risk_appetite_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          approval_status: string | null
          approved_by_user_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          effective_date: string | null
          id: string
          organization_id: string | null
          policy_name: string
          policy_type: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          approval_status?: string | null
          approved_by_user_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          effective_date?: string | null
          id?: string
          organization_id?: string | null
          policy_name: string
          policy_type?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          approval_status?: string | null
          approved_by_user_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          effective_date?: string | null
          id?: string
          organization_id?: string | null
          policy_name?: string
          policy_type?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          organization_id: string | null
          phone: string | null
          role_title: string | null
          status: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          organization_id?: string | null
          phone?: string | null
          role_title?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          organization_id?: string | null
          phone?: string | null
          role_title?: string | null
          status?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_controls: {
        Row: {
          control_id: string
          id: string
          risk_id: string
        }
        Insert: {
          control_id: string
          id?: string
          risk_id: string
        }
        Update: {
          control_id?: string
          id?: string
          risk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_controls_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_controls_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "risks"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_treatments: {
        Row: {
          action_description: string | null
          created_at: string
          id: string
          risk_id: string
          status: string | null
          target_date: string | null
          treatment_type: string
          updated_at: string
        }
        Insert: {
          action_description?: string | null
          created_at?: string
          id?: string
          risk_id: string
          status?: string | null
          target_date?: string | null
          treatment_type: string
          updated_at?: string
        }
        Update: {
          action_description?: string | null
          created_at?: string
          id?: string
          risk_id?: string
          status?: string | null
          target_date?: string | null
          treatment_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_treatments_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "risks"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          asset_id: string | null
          created_at: string
          description: string | null
          id: string
          impact: string | null
          impact_score: number | null
          likelihood: string | null
          likelihood_score: number | null
          organization_id: string | null
          risk_owner_user_id: string | null
          risk_score: number | null
          risk_title: string
          status: string | null
          threat_description: string | null
          updated_at: string
          vulnerability_description: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          impact?: string | null
          impact_score?: number | null
          likelihood?: string | null
          likelihood_score?: number | null
          organization_id?: string | null
          risk_owner_user_id?: string | null
          risk_score?: number | null
          risk_title: string
          status?: string | null
          threat_description?: string | null
          updated_at?: string
          vulnerability_description?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          impact?: string | null
          impact_score?: number | null
          likelihood?: string | null
          likelihood_score?: number | null
          organization_id?: string | null
          risk_owner_user_id?: string | null
          risk_score?: number | null
          risk_title?: string
          status?: string | null
          threat_description?: string | null
          updated_at?: string
          vulnerability_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          role_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          role_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          role_name?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          agent_id: string
          assigned_by: string
          assigned_to: string
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          result: Json | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          assigned_by: string
          assigned_to: string
          category: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          result?: Json | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          assigned_by?: string
          assigned_to?: string
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          result?: Json | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_assign_tasks: { Args: { _user_id: string }; Returns: boolean }
      can_create_agents: { Args: { _user_id: string }; Returns: boolean }
      can_manage_templates: { Args: { _user_id: string }; Returns: boolean }
      can_view_executive_data: { Args: { _user_id: string }; Returns: boolean }
      can_view_operations: { Args: { _user_id: string }; Returns: boolean }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_ciso: { Args: { _user_id: string }; Returns: boolean }
      is_executive: { Args: { _user_id: string }; Returns: boolean }
      is_manager: { Args: { _user_id: string }; Returns: boolean }
      is_operational: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      agent_status: "active" | "inactive" | "pending" | "error"
      agent_type: "vcompliance" | "vaudit" | "vrisk" | "vgovernance"
      app_role:
        | "admin"
        | "ciso"
        | "soc"
        | "auditor"
        | "operational"
        | "executive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["active", "inactive", "pending", "error"],
      agent_type: ["vcompliance", "vaudit", "vrisk", "vgovernance"],
      app_role: ["admin", "ciso", "soc", "auditor", "operational", "executive"],
    },
  },
} as const
