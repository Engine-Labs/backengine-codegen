export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          ip_address: string
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Relationships: []
      }
      flow_state: {
        Row: {
          auth_code: string
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at: string | null
          id: string
          provider_access_token: string | null
          provider_refresh_token: string | null
          provider_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_code: string
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_code?: string
          authentication_method?: string
          code_challenge?: string
          code_challenge_method?: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id?: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identities: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity_data: Json
          last_sign_in_at: string | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          identity_data: Json
          last_sign_in_at?: string | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data?: Json
          last_sign_in_at?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      instances: {
        Row: {
          created_at: string | null
          id: string
          raw_base_config: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      mfa_amr_claims: {
        Row: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Update: {
          authentication_method?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_amr_claims_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      mfa_challenges: {
        Row: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          verified_at: string | null
        }
        Insert: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          factor_id?: string
          id?: string
          ip_address?: unknown
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_challenges_auth_factor_id_fkey"
            columns: ["factor_id"]
            referencedRelation: "mfa_factors"
            referencedColumns: ["id"]
          }
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name: string | null
          id: string
          secret: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id: string
          secret?: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          factor_type?: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id?: string
          secret?: string | null
          status?: Database["auth"]["Enums"]["factor_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_factors_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          id: number
          instance_id: string | null
          parent: string | null
          revoked: boolean | null
          session_id: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      saml_providers: {
        Row: {
          attribute_mapping: Json | null
          created_at: string | null
          entity_id: string
          id: string
          metadata_url: string | null
          metadata_xml: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id: string
          id: string
          metadata_url?: string | null
          metadata_xml: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id?: string
          id?: string
          metadata_url?: string | null
          metadata_xml?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_providers_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      saml_relay_states: {
        Row: {
          created_at: string | null
          for_email: string | null
          from_ip_address: unknown | null
          id: string
          redirect_to: string | null
          request_id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          for_email?: string | null
          from_ip_address?: unknown | null
          id: string
          redirect_to?: string | null
          request_id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          for_email?: string | null
          from_ip_address?: unknown | null
          id?: string
          redirect_to?: string | null
          request_id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_relay_states_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      schema_migrations: {
        Row: {
          version: string
        }
        Insert: {
          version: string
        }
        Update: {
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          aal: Database["auth"]["Enums"]["aal_level"] | null
          created_at: string | null
          factor_id: string | null
          id: string
          not_after: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id: string
          not_after?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id?: string
          not_after?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sso_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_domains_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      sso_providers: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_sso_user: boolean
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id: string
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      code_challenge_method: "s256" | "plain"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  extensions: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      pg_stat_statements: {
        Row: {
          blk_read_time: number | null
          blk_write_time: number | null
          calls: number | null
          dbid: unknown | null
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          min_exec_time: number | null
          min_plan_time: number | null
          plans: number | null
          query: string | null
          queryid: number | null
          rows: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown | null
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
      pg_stat_statements_info: {
        Row: {
          dealloc: number | null
          stats_reset: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      algorithm_sign: {
        Args: {
          signables: string
          secret: string
          algorithm: string
        }
        Returns: string
      }
      armor: {
        Args: {
          "": string
        }
        Returns: string
      }
      dearmor: {
        Args: {
          "": string
        }
        Returns: string
      }
      gen_random_bytes: {
        Args: {
          "": number
        }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: {
          "": string
        }
        Returns: string
      }
      pg_stat_statements: {
        Args: {
          showtext: boolean
        }
        Returns: Record<string, unknown>[]
      }
      pg_stat_statements_info: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      pg_stat_statements_reset: {
        Args: {
          userid?: unknown
          dbid?: unknown
          queryid?: number
        }
        Returns: undefined
      }
      pgp_armor_headers: {
        Args: {
          "": string
        }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: {
          "": string
        }
        Returns: string
      }
      sign: {
        Args: {
          payload: Json
          secret: string
          algorithm?: string
        }
        Returns: string
      }
      try_cast_double: {
        Args: {
          inp: string
        }
        Returns: number
      }
      url_decode: {
        Args: {
          data: string
        }
        Returns: string
      }
      url_encode: {
        Args: {
          data: string
        }
        Returns: string
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: {
          namespace: string
          name: string
        }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: {
          namespace: string
          name: string
        }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      verify: {
        Args: {
          token: string
          secret: string
          algorithm?: string
        }
        Returns: {
          header: Json
          payload: Json
          valid: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  graphql: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _internal_resolve: {
        Args: {
          query: string
          variables?: Json
          operationName?: string
          extensions?: Json
        }
        Returns: Json
      }
      comment_directive: {
        Args: {
          comment_: string
        }
        Returns: Json
      }
      exception: {
        Args: {
          message: string
        }
        Returns: string
      }
      get_schema_version: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      resolve: {
        Args: {
          query: string
          variables?: Json
          operationName?: string
          extensions?: Json
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
  pgsodium: {
    Tables: {
      key: {
        Row: {
          associated_data: string | null
          comment: string | null
          created: string
          expires: string | null
          id: string
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          parent_key: string | null
          raw_key: string | null
          raw_key_nonce: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
          user_data: string | null
        }
        Insert: {
          associated_data?: string | null
          comment?: string | null
          created?: string
          expires?: string | null
          id?: string
          key_context?: string | null
          key_id?: number | null
          key_type?: Database["pgsodium"]["Enums"]["key_type"] | null
          name?: string | null
          parent_key?: string | null
          raw_key?: string | null
          raw_key_nonce?: string | null
          status?: Database["pgsodium"]["Enums"]["key_status"] | null
          user_data?: string | null
        }
        Update: {
          associated_data?: string | null
          comment?: string | null
          created?: string
          expires?: string | null
          id?: string
          key_context?: string | null
          key_id?: number | null
          key_type?: Database["pgsodium"]["Enums"]["key_type"] | null
          name?: string | null
          parent_key?: string | null
          raw_key?: string | null
          raw_key_nonce?: string | null
          status?: Database["pgsodium"]["Enums"]["key_status"] | null
          user_data?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "key_parent_key_fkey"
            columns: ["parent_key"]
            referencedRelation: "key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_parent_key_fkey"
            columns: ["parent_key"]
            referencedRelation: "decrypted_key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_parent_key_fkey"
            columns: ["parent_key"]
            referencedRelation: "valid_key"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      decrypted_key: {
        Row: {
          associated_data: string | null
          comment: string | null
          created: string | null
          decrypted_raw_key: string | null
          expires: string | null
          id: string | null
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          parent_key: string | null
          raw_key: string | null
          raw_key_nonce: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
        }
        Insert: {
          associated_data?: string | null
          comment?: string | null
          created?: string | null
          decrypted_raw_key?: never
          expires?: string | null
          id?: string | null
          key_context?: string | null
          key_id?: number | null
          key_type?: Database["pgsodium"]["Enums"]["key_type"] | null
          name?: string | null
          parent_key?: string | null
          raw_key?: string | null
          raw_key_nonce?: string | null
          status?: Database["pgsodium"]["Enums"]["key_status"] | null
        }
        Update: {
          associated_data?: string | null
          comment?: string | null
          created?: string | null
          decrypted_raw_key?: never
          expires?: string | null
          id?: string | null
          key_context?: string | null
          key_id?: number | null
          key_type?: Database["pgsodium"]["Enums"]["key_type"] | null
          name?: string | null
          parent_key?: string | null
          raw_key?: string | null
          raw_key_nonce?: string | null
          status?: Database["pgsodium"]["Enums"]["key_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "key_parent_key_fkey"
            columns: ["parent_key"]
            referencedRelation: "key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_parent_key_fkey"
            columns: ["parent_key"]
            referencedRelation: "decrypted_key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_parent_key_fkey"
            columns: ["parent_key"]
            referencedRelation: "valid_key"
            referencedColumns: ["id"]
          }
        ]
      }
      mask_columns: {
        Row: {
          associated_columns: string | null
          attname: unknown | null
          attrelid: unknown | null
          format_type: string | null
          key_id: string | null
          key_id_column: string | null
          nonce_column: string | null
        }
        Relationships: []
      }
      masking_rule: {
        Row: {
          associated_columns: string | null
          attname: unknown | null
          attnum: number | null
          attrelid: unknown | null
          col_description: string | null
          format_type: string | null
          key_id: string | null
          key_id_column: string | null
          nonce_column: string | null
          priority: number | null
          relname: unknown | null
          relnamespace: unknown | null
          security_invoker: boolean | null
          view_name: string | null
        }
        Relationships: []
      }
      valid_key: {
        Row: {
          associated_data: string | null
          created: string | null
          expires: string | null
          id: string | null
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
        }
        Insert: {
          associated_data?: string | null
          created?: string | null
          expires?: string | null
          id?: string | null
          key_context?: string | null
          key_id?: number | null
          key_type?: Database["pgsodium"]["Enums"]["key_type"] | null
          name?: string | null
          status?: Database["pgsodium"]["Enums"]["key_status"] | null
        }
        Update: {
          associated_data?: string | null
          created?: string | null
          expires?: string | null
          id?: string | null
          key_context?: string | null
          key_id?: number | null
          key_type?: Database["pgsodium"]["Enums"]["key_type"] | null
          name?: string | null
          status?: Database["pgsodium"]["Enums"]["key_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_key: {
        Args: {
          key_type?: Database["pgsodium"]["Enums"]["key_type"]
          name?: string
          raw_key?: string
          raw_key_nonce?: string
          parent_key?: string
          key_context?: string
          expires?: string
          associated_data?: string
        }
        Returns: {
          associated_data: string | null
          created: string | null
          expires: string | null
          id: string | null
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
        }
      }
      create_mask_view:
        | {
            Args: {
              relid: unknown
              debug?: boolean
            }
            Returns: undefined
          }
        | {
            Args: {
              relid: unknown
              subid: number
              debug?: boolean
            }
            Returns: undefined
          }
      crypto_aead_det_decrypt:
        | {
            Args: {
              ciphertext: string
              additional: string
              key: string
              nonce?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              key_id: number
              context?: string
              nonce?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              key_uuid: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              key_uuid: string
              nonce: string
            }
            Returns: string
          }
      crypto_aead_det_encrypt:
        | {
            Args: {
              message: string
              additional: string
              key: string
              nonce?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              key_id: number
              context?: string
              nonce?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              key_uuid: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              key_uuid: string
              nonce: string
            }
            Returns: string
          }
      crypto_aead_det_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_aead_det_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_aead_ietf_decrypt:
        | {
            Args: {
              message: string
              additional: string
              nonce: string
              key: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              nonce: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              nonce: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_aead_ietf_encrypt:
        | {
            Args: {
              message: string
              additional: string
              nonce: string
              key: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              nonce: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              additional: string
              nonce: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_aead_ietf_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_aead_ietf_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_auth:
        | {
            Args: {
              message: string
              key: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_auth_hmacsha256:
        | {
            Args: {
              message: string
              secret: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_auth_hmacsha256_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_auth_hmacsha256_verify:
        | {
            Args: {
              hash: string
              message: string
              secret: string
            }
            Returns: boolean
          }
        | {
            Args: {
              hash: string
              message: string
              key_id: number
              context?: string
            }
            Returns: boolean
          }
        | {
            Args: {
              signature: string
              message: string
              key_uuid: string
            }
            Returns: boolean
          }
      crypto_auth_hmacsha512:
        | {
            Args: {
              message: string
              secret: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_auth_hmacsha512_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_auth_hmacsha512_verify:
        | {
            Args: {
              hash: string
              message: string
              key_id: number
              context?: string
            }
            Returns: boolean
          }
        | {
            Args: {
              hash: string
              message: string
              secret: string
            }
            Returns: boolean
          }
        | {
            Args: {
              signature: string
              message: string
              key_uuid: string
            }
            Returns: boolean
          }
      crypto_auth_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_auth_verify:
        | {
            Args: {
              mac: string
              message: string
              key: string
            }
            Returns: boolean
          }
        | {
            Args: {
              mac: string
              message: string
              key_id: number
              context?: string
            }
            Returns: boolean
          }
        | {
            Args: {
              mac: string
              message: string
              key_uuid: string
            }
            Returns: boolean
          }
      crypto_box: {
        Args: {
          message: string
          nonce: string
          public: string
          secret: string
        }
        Returns: string
      }
      crypto_box_new_keypair: {
        Args: Record<PropertyKey, never>
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_box_keypair"]
      }
      crypto_box_new_seed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_box_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_box_open: {
        Args: {
          ciphertext: string
          nonce: string
          public: string
          secret: string
        }
        Returns: string
      }
      crypto_box_seal: {
        Args: {
          message: string
          public_key: string
        }
        Returns: string
      }
      crypto_box_seal_open: {
        Args: {
          ciphertext: string
          public_key: string
          secret_key: string
        }
        Returns: string
      }
      crypto_box_seed_new_keypair: {
        Args: {
          seed: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_box_keypair"]
      }
      crypto_generichash:
        | {
            Args: {
              message: string
              key: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_generichash_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_hash_sha256: {
        Args: {
          message: string
        }
        Returns: string
      }
      crypto_hash_sha512: {
        Args: {
          message: string
        }
        Returns: string
      }
      crypto_kdf_derive_from_key:
        | {
            Args: {
              subkey_size: number
              subkey_id: number
              context: string
              primary_key: string
            }
            Returns: string
          }
        | {
            Args: {
              subkey_size: number
              subkey_id: number
              context: string
              primary_key: string
            }
            Returns: string
          }
      crypto_kdf_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_kx_client_session_keys: {
        Args: {
          client_pk: string
          client_sk: string
          server_pk: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_kx_session"]
      }
      crypto_kx_new_keypair: {
        Args: Record<PropertyKey, never>
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_kx_keypair"]
      }
      crypto_kx_new_seed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_kx_seed_new_keypair: {
        Args: {
          seed: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_kx_keypair"]
      }
      crypto_kx_server_session_keys: {
        Args: {
          server_pk: string
          server_sk: string
          client_pk: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_kx_session"]
      }
      crypto_pwhash: {
        Args: {
          password: string
          salt: string
        }
        Returns: string
      }
      crypto_pwhash_saltgen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_pwhash_str: {
        Args: {
          password: string
        }
        Returns: string
      }
      crypto_pwhash_str_verify: {
        Args: {
          hashed_password: string
          password: string
        }
        Returns: boolean
      }
      crypto_secretbox:
        | {
            Args: {
              message: string
              nonce: string
              key: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              nonce: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              nonce: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_secretbox_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_secretbox_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_secretbox_open:
        | {
            Args: {
              ciphertext: string
              nonce: string
              key: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              nonce: string
              key_id: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              nonce: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_secretstream_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_shorthash:
        | {
            Args: {
              message: string
              key: number
              context?: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key: string
            }
            Returns: string
          }
        | {
            Args: {
              message: string
              key_uuid: string
            }
            Returns: string
          }
      crypto_shorthash_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_sign: {
        Args: {
          message: string
          key: string
        }
        Returns: string
      }
      crypto_sign_detached: {
        Args: {
          message: string
          key: string
        }
        Returns: string
      }
      crypto_sign_final_create: {
        Args: {
          state: string
          key: string
        }
        Returns: string
      }
      crypto_sign_final_verify: {
        Args: {
          state: string
          signature: string
          key: string
        }
        Returns: boolean
      }
      crypto_sign_init: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_sign_new_keypair: {
        Args: Record<PropertyKey, never>
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_sign_keypair"]
      }
      crypto_sign_new_seed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_sign_open: {
        Args: {
          signed_message: string
          key: string
        }
        Returns: string
      }
      crypto_sign_seed_new_keypair: {
        Args: {
          seed: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_sign_keypair"]
      }
      crypto_sign_update: {
        Args: {
          state: string
          message: string
        }
        Returns: string
      }
      crypto_sign_update_agg1: {
        Args: {
          state: string
          message: string
        }
        Returns: string
      }
      crypto_sign_update_agg2: {
        Args: {
          cur_state: string
          initial_state: string
          message: string
        }
        Returns: string
      }
      crypto_sign_verify_detached: {
        Args: {
          sig: string
          message: string
          key: string
        }
        Returns: boolean
      }
      crypto_signcrypt_new_keypair: {
        Args: Record<PropertyKey, never>
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_signcrypt_keypair"]
      }
      crypto_signcrypt_sign_after: {
        Args: {
          state: string
          sender_sk: string
          ciphertext: string
        }
        Returns: string
      }
      crypto_signcrypt_sign_before: {
        Args: {
          sender: string
          recipient: string
          sender_sk: string
          recipient_pk: string
          additional: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_signcrypt_state_key"]
      }
      crypto_signcrypt_verify_after: {
        Args: {
          state: string
          signature: string
          sender_pk: string
          ciphertext: string
        }
        Returns: boolean
      }
      crypto_signcrypt_verify_before: {
        Args: {
          signature: string
          sender: string
          recipient: string
          additional: string
          sender_pk: string
          recipient_sk: string
        }
        Returns: Database["pgsodium"]["CompositeTypes"]["crypto_signcrypt_state_key"]
      }
      crypto_signcrypt_verify_public: {
        Args: {
          signature: string
          sender: string
          recipient: string
          additional: string
          sender_pk: string
          ciphertext: string
        }
        Returns: boolean
      }
      crypto_stream_xchacha20_keygen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      crypto_stream_xchacha20_noncegen: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      decrypted_columns: {
        Args: {
          relid: unknown
        }
        Returns: string
      }
      derive_key: {
        Args: {
          key_id: number
          key_len?: number
          context?: string
        }
        Returns: string
      }
      disable_security_label_trigger: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enable_security_label_trigger: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      encrypted_column: {
        Args: {
          relid: unknown
          m: Record<string, unknown>
        }
        Returns: string
      }
      encrypted_columns: {
        Args: {
          relid: unknown
        }
        Returns: string
      }
      get_key_by_id: {
        Args: {
          "": string
        }
        Returns: {
          associated_data: string | null
          created: string | null
          expires: string | null
          id: string | null
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
        }
      }
      get_key_by_name: {
        Args: {
          "": string
        }
        Returns: {
          associated_data: string | null
          created: string | null
          expires: string | null
          id: string | null
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
        }
      }
      get_named_keys: {
        Args: {
          filter?: string
        }
        Returns: {
          associated_data: string | null
          created: string | null
          expires: string | null
          id: string | null
          key_context: string | null
          key_id: number | null
          key_type: Database["pgsodium"]["Enums"]["key_type"] | null
          name: string | null
          status: Database["pgsodium"]["Enums"]["key_status"] | null
        }[]
      }
      has_mask: {
        Args: {
          role: unknown
          source_name: string
        }
        Returns: boolean
      }
      mask_columns: {
        Args: {
          source_relid: unknown
        }
        Returns: {
          attname: unknown
          key_id: string
          key_id_column: string
          associated_column: string
          nonce_column: string
          format_type: string
        }[]
      }
      mask_role: {
        Args: {
          masked_role: unknown
          source_name: string
          view_name: string
        }
        Returns: undefined
      }
      pgsodium_derive: {
        Args: {
          key_id: number
          key_len?: number
          context?: string
        }
        Returns: string
      }
      randombytes_buf: {
        Args: {
          size: number
        }
        Returns: string
      }
      randombytes_buf_deterministic: {
        Args: {
          size: number
          seed: string
        }
        Returns: string
      }
      randombytes_new_seed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      randombytes_random: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      randombytes_uniform: {
        Args: {
          upper_bound: number
        }
        Returns: number
      }
      sodium_base642bin: {
        Args: {
          base64: string
        }
        Returns: string
      }
      sodium_bin2base64: {
        Args: {
          bin: string
        }
        Returns: string
      }
      update_mask: {
        Args: {
          target: unknown
          debug?: boolean
        }
        Returns: undefined
      }
      update_masks: {
        Args: {
          debug?: boolean
        }
        Returns: undefined
      }
      version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      key_status: "default" | "valid" | "invalid" | "expired"
      key_type:
        | "aead-ietf"
        | "aead-det"
        | "hmacsha512"
        | "hmacsha256"
        | "auth"
        | "shorthash"
        | "generichash"
        | "kdf"
        | "secretbox"
        | "secretstream"
        | "stream_xchacha20"
    }
    CompositeTypes: {
      crypto_box_keypair: {
        public: string
        secret: string
      }
      crypto_kx_keypair: {
        public: string
        secret: string
      }
      crypto_kx_session: {
        rx: string
        tx: string
      }
      crypto_sign_keypair: {
        public: string
        secret: string
      }
      crypto_signcrypt_keypair: {
        public: string
        secret: string
      }
      crypto_signcrypt_state_key: {
        state: string
        shared_key: string
      }
    }
  }
  pgsodium_masks: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  realtime: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  vault: {
    Tables: {
      secrets: {
        Row: {
          created_at: string
          description: string
          id: string
          key_id: string | null
          name: string | null
          nonce: string | null
          secret: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "secrets_key_id_fkey"
            columns: ["key_id"]
            referencedRelation: "key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secrets_key_id_fkey"
            columns: ["key_id"]
            referencedRelation: "decrypted_key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secrets_key_id_fkey"
            columns: ["key_id"]
            referencedRelation: "valid_key"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      decrypted_secrets: {
        Row: {
          created_at: string | null
          decrypted_secret: string | null
          description: string | null
          id: string | null
          key_id: string | null
          name: string | null
          nonce: string | null
          secret: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_secret?: never
          description?: string | null
          id?: string | null
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_secret?: never
          description?: string | null
          id?: string | null
          key_id?: string | null
          name?: string | null
          nonce?: string | null
          secret?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secrets_key_id_fkey"
            columns: ["key_id"]
            referencedRelation: "key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secrets_key_id_fkey"
            columns: ["key_id"]
            referencedRelation: "decrypted_key"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secrets_key_id_fkey"
            columns: ["key_id"]
            referencedRelation: "valid_key"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      create_secret: {
        Args: {
          new_secret: string
          new_name?: string
          new_description?: string
          new_key_id?: string
        }
        Returns: string
      }
      update_secret: {
        Args: {
          secret_id: string
          new_secret?: string
          new_name?: string
          new_description?: string
          new_key_id?: string
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
