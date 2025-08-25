export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      advisors: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          position: number | null
          slug: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          position?: number | null
          slug: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          position?: number | null
          slug?: string
        }
        Relationships: []
      }
      air_assignment: {
        Row: {
          created_at: string | null
          id: number
          materia_id: number
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          materia_id: number
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          materia_id?: number
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "air_assignment_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "air_materia"
            referencedColumns: ["id"]
          },
        ]
      }
      air_materia: {
        Row: {
          activo: boolean | null
          id: number
          nombre: string
          slug: string
          typeform_form_id: string
        }
        Insert: {
          activo?: boolean | null
          id?: number
          nombre: string
          slug: string
          typeform_form_id: string
        }
        Update: {
          activo?: boolean | null
          id?: number
          nombre?: string
          slug?: string
          typeform_form_id?: string
        }
        Relationships: []
      }
      air_submission: {
        Row: {
          assignment_id: number
          created_at: string | null
          id: number
          payload_json: Json | null
          typeform_submission_id: string
        }
        Insert: {
          assignment_id: number
          created_at?: string | null
          id?: number
          payload_json?: Json | null
          typeform_submission_id: string
        }
        Update: {
          assignment_id?: number
          created_at?: string | null
          id?: number
          payload_json?: Json | null
          typeform_submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "air_submission_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "air_assignment"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: number
          tags: string[] | null
          title: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id?: number
          tags?: string[] | null
          title?: string | null
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: number
          tags?: string[] | null
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: []
      }
      assistant_profiles: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          instructions_version: string | null
          model: string | null
          provider: string | null
          scope: string
          slug: string
          stt_model: string | null
          tools_json: Json | null
          tts_voice_id: string | null
          vector_store_hint: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          instructions_version?: string | null
          model?: string | null
          provider?: string | null
          scope: string
          slug: string
          stt_model?: string | null
          tools_json?: Json | null
          tts_voice_id?: string | null
          vector_store_hint?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          instructions_version?: string | null
          model?: string | null
          provider?: string | null
          scope?: string
          slug?: string
          stt_model?: string | null
          tools_json?: Json | null
          tts_voice_id?: string | null
          vector_store_hint?: string | null
        }
        Relationships: []
      }
      batch_job_results: {
        Row: {
          created_at: string | null
          details_json: Json | null
          id: number
          job_id: number
          ok: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details_json?: Json | null
          id?: number
          job_id: number
          ok?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details_json?: Json | null
          id?: number
          job_id?: number
          ok?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_job_results_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "batch_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_jobs: {
        Row: {
          code: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          id: number
          params_json: Json
          status: string
          type: string
        }
        Insert: {
          code?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          params_json: Json
          status?: string
          type: string
        }
        Update: {
          code?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          params_json?: Json
          status?: string
          type?: string
        }
        Relationships: []
      }
      dimensions_catalog: {
        Row: {
          id: number
          materia_id: number
          name: string
          position: number | null
          slug: string
        }
        Insert: {
          id?: number
          materia_id: number
          name: string
          position?: number | null
          slug: string
        }
        Update: {
          id?: number
          materia_id?: number
          name?: string
          position?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "dimensions_catalog_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      event_log: {
        Row: {
          action: string
          app: string | null
          entity: string | null
          entity_id: number | null
          id: number
          metadata: Json | null
          ts: string
          user_id: string | null
        }
        Insert: {
          action: string
          app?: string | null
          entity?: string | null
          entity_id?: number | null
          id?: number
          metadata?: Json | null
          ts?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          app?: string | null
          entity?: string | null
          entity_id?: number | null
          id?: number
          metadata?: Json | null
          ts?: string
          user_id?: string | null
        }
        Relationships: []
      }
      import_audit: {
        Row: {
          assets_new: number
          assets_reused: number
          errors: Json | null
          id: number
          kpis_new: number
          lp_id: number
          source_ref: string | null
          source_type: string
          ts: string
          user_id: string | null
        }
        Insert: {
          assets_new?: number
          assets_reused?: number
          errors?: Json | null
          id?: number
          kpis_new?: number
          lp_id: number
          source_ref?: string | null
          source_type: string
          ts?: string
          user_id?: string | null
        }
        Update: {
          assets_new?: number
          assets_reused?: number
          errors?: Json | null
          id?: number
          kpis_new?: number
          lp_id?: number
          source_ref?: string | null
          source_type?: string
          ts?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_audit_lp_id_fkey"
            columns: ["lp_id"]
            isOneToOne: false
            referencedRelation: "lp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_audit_lp_id_fkey"
            columns: ["lp_id"]
            isOneToOne: false
            referencedRelation: "v_lp_quality"
            referencedColumns: ["lp_id"]
          },
        ]
      }
      lp: {
        Row: {
          created_at: string | null
          id: number
          notes: string | null
          status: string
          updated_at: string | null
          user_id: string
          version: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          notes?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          version?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          notes?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      lp_checkpoint_progress: {
        Row: {
          checkpoint_id: number
          completed_at: string
          lp_item_id: number
          user_id: string
        }
        Insert: {
          checkpoint_id: number
          completed_at?: string
          lp_item_id: number
          user_id: string
        }
        Update: {
          checkpoint_id?: number
          completed_at?: string
          lp_item_id?: number
          user_id?: string
        }
        Relationships: []
      }
      lp_item_assets: {
        Row: {
          asset_id: number
          created_at: string | null
          id: number
          lp_item_id: number
          note: string | null
          position: number | null
        }
        Insert: {
          asset_id: number
          created_at?: string | null
          id?: number
          lp_item_id: number
          note?: string | null
          position?: number | null
        }
        Update: {
          asset_id?: number
          created_at?: string | null
          id?: number
          lp_item_id?: number
          note?: string | null
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lp_item_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_item_assets_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "lp_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_item_assets_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "v_lp_item_progress"
            referencedColumns: ["lp_item_id"]
          },
          {
            foreignKeyName: "lp_item_assets_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "v_lp_quality"
            referencedColumns: ["lp_item_id"]
          },
        ]
      }
      lp_item_checkpoints: {
        Row: {
          created_at: string | null
          done_at: string | null
          id: number
          lp_item_id: number
          position: number | null
          required: boolean | null
          text: string
        }
        Insert: {
          created_at?: string | null
          done_at?: string | null
          id?: number
          lp_item_id: number
          position?: number | null
          required?: boolean | null
          text: string
        }
        Update: {
          created_at?: string | null
          done_at?: string | null
          id?: number
          lp_item_id?: number
          position?: number | null
          required?: boolean | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "lp_item_checkpoints_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "lp_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_item_checkpoints_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "v_lp_item_progress"
            referencedColumns: ["lp_item_id"]
          },
          {
            foreignKeyName: "lp_item_checkpoints_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "v_lp_quality"
            referencedColumns: ["lp_item_id"]
          },
        ]
      }
      lp_item_todos: {
        Row: {
          due_offset_days: number | null
          id: number
          lp_item_id: number
          notes: string | null
          position: number | null
          required: boolean | null
          todo_template_id: number
        }
        Insert: {
          due_offset_days?: number | null
          id?: number
          lp_item_id: number
          notes?: string | null
          position?: number | null
          required?: boolean | null
          todo_template_id: number
        }
        Update: {
          due_offset_days?: number | null
          id?: number
          lp_item_id?: number
          notes?: string | null
          position?: number | null
          required?: boolean | null
          todo_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lp_item_todos_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "lp_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_item_todos_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "v_lp_item_progress"
            referencedColumns: ["lp_item_id"]
          },
          {
            foreignKeyName: "lp_item_todos_lp_item_id_fkey"
            columns: ["lp_item_id"]
            isOneToOne: false
            referencedRelation: "v_lp_quality"
            referencedColumns: ["lp_item_id"]
          },
          {
            foreignKeyName: "lp_item_todos_todo_template_id_fkey"
            columns: ["todo_template_id"]
            isOneToOne: false
            referencedRelation: "todo_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_item_todos_todo_template_id_fkey"
            columns: ["todo_template_id"]
            isOneToOne: false
            referencedRelation: "vw_todo_templates_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      lp_items: {
        Row: {
          id: number
          lp_id: number
          position: number | null
          session_id: number
        }
        Insert: {
          id?: number
          lp_id: number
          position?: number | null
          session_id: number
        }
        Update: {
          id?: number
          lp_id?: number
          position?: number | null
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "lp_items_lp_id_fkey"
            columns: ["lp_id"]
            isOneToOne: false
            referencedRelation: "lp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_items_lp_id_fkey"
            columns: ["lp_id"]
            isOneToOne: false
            referencedRelation: "v_lp_quality"
            referencedColumns: ["lp_id"]
          },
          {
            foreignKeyName: "lp_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_canonical"
            referencedColumns: ["session_id"]
          },
        ]
      }
      lp_snapshot: {
        Row: {
          created_at: string
          csv_text: string
          id: number
          kind: string
          lp_id: number
          snapshot_csv: string
          ts: string
          user_id: string
        }
        Insert: {
          created_at?: string
          csv_text: string
          id?: number
          kind: string
          lp_id: number
          snapshot_csv: string
          ts?: string
          user_id: string
        }
        Update: {
          created_at?: string
          csv_text?: string
          id?: number
          kind?: string
          lp_id?: number
          snapshot_csv?: string
          ts?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lp_snapshot_lp_id_fkey"
            columns: ["lp_id"]
            isOneToOne: false
            referencedRelation: "lp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lp_snapshot_lp_id_fkey"
            columns: ["lp_id"]
            isOneToOne: false
            referencedRelation: "v_lp_quality"
            referencedColumns: ["lp_id"]
          },
        ]
      }
      materias_catalog: {
        Row: {
          active: boolean | null
          id: number
          name: string
          position: number | null
          program_id: number
          slug: string
        }
        Insert: {
          active?: boolean | null
          id?: number
          name: string
          position?: number | null
          program_id: number
          slug: string
        }
        Update: {
          active?: boolean | null
          id?: number
          name?: string
          position?: number | null
          program_id?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "materias_catalog_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      ops_assistant_bindings: {
        Row: {
          active: boolean | null
          advisor_id: number
          assistant_profile_id: number
          id: number
        }
        Insert: {
          active?: boolean | null
          advisor_id: number
          assistant_profile_id: number
          id?: number
        }
        Update: {
          active?: boolean | null
          advisor_id?: number
          assistant_profile_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ops_assistant_bindings_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ops_assistant_bindings_assistant_profile_id_fkey"
            columns: ["assistant_profile_id"]
            isOneToOne: false
            referencedRelation: "assistant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      package_air_bundle: {
        Row: {
          materia_slug: string
          package_id: number
        }
        Insert: {
          materia_slug: string
          package_id: number
        }
        Update: {
          materia_slug?: string
          package_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "package_air_bundle_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "siom_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_lp_rules: {
        Row: {
          dimension_slug: string | null
          explicit_session_slugs: string[] | null
          id: number
          materia_slug: string | null
          package_id: number
          rule_param_n: number | null
          rule_type: string
        }
        Insert: {
          dimension_slug?: string | null
          explicit_session_slugs?: string[] | null
          id?: number
          materia_slug?: string | null
          package_id: number
          rule_param_n?: number | null
          rule_type: string
        }
        Update: {
          dimension_slug?: string | null
          explicit_session_slugs?: string[] | null
          id?: number
          materia_slug?: string | null
          package_id?: number
          rule_param_n?: number | null
          rule_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_lp_rules_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "siom_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          alias: string | null
          archived: boolean | null
          archived_at: string | null
          created_at: string | null
          full_name: string | null
          group: string | null
          id: string
          organization: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          alias?: string | null
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string | null
          full_name?: string | null
          group?: string | null
          id: string
          organization?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          alias?: string | null
          archived?: boolean | null
          archived_at?: string | null
          created_at?: string | null
          full_name?: string | null
          group?: string | null
          id?: string
          organization?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          id: number
          name: string
          position: number | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          id?: number
          name: string
          position?: number | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          id?: number
          name?: string
          position?: number | null
        }
        Relationships: []
      }
      session_assistant_bindings: {
        Row: {
          active: boolean | null
          assistant_profile_id: number
          id: number
          session_id: number
        }
        Insert: {
          active?: boolean | null
          assistant_profile_id: number
          id?: number
          session_id: number
        }
        Update: {
          active?: boolean | null
          assistant_profile_id?: number
          id?: number
          session_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "session_assistant_bindings_assistant_profile_id_fkey"
            columns: ["assistant_profile_id"]
            isOneToOne: false
            referencedRelation: "assistant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_assistant_bindings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_assistant_bindings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_canonical"
            referencedColumns: ["session_id"]
          },
        ]
      }
      sessions_catalog: {
        Row: {
          dimension_id: number
          id: number
          name: string
          position: number | null
          session_kind: string | null
          slug: string
        }
        Insert: {
          dimension_id: number
          id?: number
          name: string
          position?: number | null
          session_kind?: string | null
          slug: string
        }
        Update: {
          dimension_id?: number
          id?: number
          name?: string
          position?: number | null
          session_kind?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_catalog_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "dimensions_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      siom_packages: {
        Row: {
          active: boolean | null
          allow_override: boolean | null
          code: string
          created_at: string | null
          default_access: Json | null
          default_rule_n: number | null
          description: string | null
          id: number
          max_materias: number | null
          name: string
        }
        Insert: {
          active?: boolean | null
          allow_override?: boolean | null
          code: string
          created_at?: string | null
          default_access?: Json | null
          default_rule_n?: number | null
          description?: string | null
          id?: number
          max_materias?: number | null
          name: string
        }
        Update: {
          active?: boolean | null
          allow_override?: boolean | null
          code?: string
          created_at?: string | null
          default_access?: Json | null
          default_rule_n?: number | null
          description?: string | null
          id?: number
          max_materias?: number | null
          name?: string
        }
        Relationships: []
      }
      todo_subtasks: {
        Row: {
          description_md: string | null
          id: number
          position: number | null
          subtitle: string
          todo_template_id: number
        }
        Insert: {
          description_md?: string | null
          id?: number
          position?: number | null
          subtitle: string
          todo_template_id: number
        }
        Update: {
          description_md?: string | null
          id?: number
          position?: number | null
          subtitle?: string
          todo_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "todo_subtasks_todo_template_id_fkey"
            columns: ["todo_template_id"]
            isOneToOne: false
            referencedRelation: "todo_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_subtasks_todo_template_id_fkey"
            columns: ["todo_template_id"]
            isOneToOne: false
            referencedRelation: "vw_todo_templates_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_template_assets: {
        Row: {
          asset_id: number
          id: number
          position: number | null
          todo_template_id: number
        }
        Insert: {
          asset_id: number
          id?: number
          position?: number | null
          todo_template_id: number
        }
        Update: {
          asset_id?: number
          id?: number
          position?: number | null
          todo_template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "todo_template_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_template_assets_todo_template_id_fkey"
            columns: ["todo_template_id"]
            isOneToOne: false
            referencedRelation: "todo_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todo_template_assets_todo_template_id_fkey"
            columns: ["todo_template_id"]
            isOneToOne: false
            referencedRelation: "vw_todo_templates_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_templates: {
        Row: {
          created_at: string | null
          description_md: string | null
          dimension_slug: string
          est_minutes: number | null
          id: number
          lang: string | null
          level: string | null
          materia_slug: string
          order_visual: number | null
          prereq_skill_ids: string[] | null
          session_kind: string | null
          session_slug: string | null
          skill_id: string
          source_json: Json | null
          state: string
          tags: string[] | null
          title: string
          todo_kind: string
          version: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description_md?: string | null
          dimension_slug: string
          est_minutes?: number | null
          id?: number
          lang?: string | null
          level?: string | null
          materia_slug: string
          order_visual?: number | null
          prereq_skill_ids?: string[] | null
          session_kind?: string | null
          session_slug?: string | null
          skill_id: string
          source_json?: Json | null
          state?: string
          tags?: string[] | null
          title: string
          todo_kind?: string
          version?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description_md?: string | null
          dimension_slug?: string
          est_minutes?: number | null
          id?: number
          lang?: string | null
          level?: string | null
          materia_slug?: string
          order_visual?: number | null
          prereq_skill_ids?: string[] | null
          session_kind?: string | null
          session_slug?: string | null
          skill_id?: string
          source_json?: Json | null
          state?: string
          tags?: string[] | null
          title?: string
          todo_kind?: string
          version?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      todos_staging_raw: {
        Row: {
          created_at: string | null
          descripcion: string | null
          dimension_slug: string
          estado: string | null
          estudios: string | null
          id: number
          lang: string | null
          materia_slug: string
          minutos: number | null
          nivel: string | null
          orden: number | null
          ponderacion: number | null
          prerequisitos: string | null
          session_kind: string | null
          session_slug: string | null
          skill_id: string
          source: string | null
          sub_apartado: string | null
          tags_raw: string | null
          titulo: string | null
          url_video: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          dimension_slug: string
          estado?: string | null
          estudios?: string | null
          id?: number
          lang?: string | null
          materia_slug: string
          minutos?: number | null
          nivel?: string | null
          orden?: number | null
          ponderacion?: number | null
          prerequisitos?: string | null
          session_kind?: string | null
          session_slug?: string | null
          skill_id: string
          source?: string | null
          sub_apartado?: string | null
          tags_raw?: string | null
          titulo?: string | null
          url_video?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          dimension_slug?: string
          estado?: string | null
          estudios?: string | null
          id?: number
          lang?: string | null
          materia_slug?: string
          minutos?: number | null
          nivel?: string | null
          orden?: number | null
          ponderacion?: number | null
          prerequisitos?: string | null
          session_kind?: string | null
          session_slug?: string | null
          skill_id?: string
          source?: string | null
          sub_apartado?: string | null
          tags_raw?: string | null
          titulo?: string | null
          url_video?: string | null
          version?: string | null
        }
        Relationships: []
      }
      user_access: {
        Row: {
          air: boolean | null
          forge_ops: boolean | null
          forge_performance: boolean | null
          psitac: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          air?: boolean | null
          forge_ops?: boolean | null
          forge_performance?: boolean | null
          psitac?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          air?: boolean | null
          forge_ops?: boolean | null
          forge_performance?: boolean | null
          psitac?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_advisor_access: {
        Row: {
          advisor_id: number
          granted_at: string | null
          user_id: string
        }
        Insert: {
          advisor_id: number
          granted_at?: string | null
          user_id: string
        }
        Update: {
          advisor_id?: number
          granted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_advisor_access_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profile: {
        Row: {
          alias: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          alias?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          alias?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_events_recent: {
        Row: {
          action: string | null
          app: string | null
          entity: string | null
          entity_id: number | null
          id: number | null
          metadata: Json | null
          ts: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_imports_7d: {
        Row: {
          assets_new: number | null
          assets_reused: number | null
          day: string | null
          error_rows: number | null
          imports: number | null
          kpis_new: number | null
        }
        Relationships: []
      }
      v_lp_item_progress: {
        Row: {
          completed_required: number | null
          lp_item_id: number | null
          pct: number | null
          total_required: number | null
        }
        Relationships: []
      }
      v_lp_quality: {
        Row: {
          assets_count: number | null
          dimension_slug: string | null
          has_gamma: boolean | null
          has_min_kpis: boolean | null
          kpis_count: number | null
          lp_id: number | null
          lp_item_id: number | null
          materia_slug: string | null
          position: number | null
          session_slug: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_sessions_canonical: {
        Row: {
          canonical_id: string | null
          dimension_name: string | null
          dimension_slug: string | null
          materia_name: string | null
          materia_slug: string | null
          position: number | null
          program_code: string | null
          program_name: string | null
          session_id: number | null
          session_kind: string | null
          session_name: string | null
          session_slug: string | null
        }
        Relationships: []
      }
      v_usage_assets: {
        Row: {
          asset_type: string | null
          total: number | null
        }
        Relationships: []
      }
      vw_todo_templates_catalog: {
        Row: {
          dimension_slug: string | null
          est_minutes: number | null
          id: number | null
          lang: string | null
          level: string | null
          materia_slug: string | null
          order_visual: number | null
          prereq_skill_ids: string[] | null
          session_ref: string | null
          skill_id: string | null
          state: string | null
          tags: string[] | null
          title: string | null
          todo_kind: string | null
          version: string | null
          weight: number | null
        }
        Insert: {
          dimension_slug?: string | null
          est_minutes?: number | null
          id?: number | null
          lang?: string | null
          level?: string | null
          materia_slug?: string | null
          order_visual?: number | null
          prereq_skill_ids?: string[] | null
          session_ref?: never
          skill_id?: string | null
          state?: string | null
          tags?: string[] | null
          title?: string | null
          todo_kind?: string | null
          version?: string | null
          weight?: number | null
        }
        Update: {
          dimension_slug?: string | null
          est_minutes?: number | null
          id?: number | null
          lang?: string | null
          level?: string | null
          materia_slug?: string | null
          order_visual?: number | null
          prereq_skill_ids?: string[] | null
          session_ref?: never
          skill_id?: string | null
          state?: string | null
          tags?: string[] | null
          title?: string | null
          todo_kind?: string | null
          version?: string | null
          weight?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      fn_execute_batch: {
        Args: { p: Json }
        Returns: {
          air_assigned: number
          lp_items_created: number
          user_id: string
        }[]
      }
      fn_nullify_nd: {
        Args: { p: string }
        Returns: string
      }
      fn_preview_batch: {
        Args: { p: Json }
        Returns: {
          air_to_assign: number
          lp_sessions_to_create: number
          user_id: string
        }[]
      }
      fn_sessions_from_rules: {
        Args: { materia_slugs: string[]; rule_by_dimension: Json }
        Returns: {
          session_id: number
        }[]
      }
      fn_split_csv: {
        Args: { p: string }
        Returns: string[]
      }
      fn_upsert_todos_from_staging: {
        Args: { p_materia: string }
        Returns: {
          assets_linked: number
          inserted: number
          updated: number
        }[]
      }
      log_event: {
        Args: {
          p_action: string
          p_app: string
          p_entity: string
          p_entity_id: number
          p_metadata?: Json
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

