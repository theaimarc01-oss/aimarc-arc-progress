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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number | null
        }
        Relationships: []
      }
      friend_challenges: {
        Row: {
          challenged_progress: number | null
          challenged_user_id: string
          created_at: string | null
          creator_id: string
          creator_progress: number | null
          duration_days: number
          end_date: string
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          start_date: string
          status: string | null
        }
        Insert: {
          challenged_progress?: number | null
          challenged_user_id: string
          created_at?: string | null
          creator_id: string
          creator_progress?: number | null
          duration_days: number
          end_date: string
          goal_type: Database["public"]["Enums"]["goal_type"]
          id?: string
          start_date: string
          status?: string | null
        }
        Update: {
          challenged_progress?: number | null
          challenged_user_id?: string
          created_at?: string | null
          creator_id?: string
          creator_progress?: number | null
          duration_days?: number
          end_date?: string
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          start_date?: string
          status?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          ai_generated: boolean | null
          completion_percentage: number | null
          created_at: string | null
          days_completed: number | null
          description: string | null
          duration_days: number | null
          end_date: string
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          intensity_level: number | null
          start_date: string
          status: Database["public"]["Enums"]["goal_status"] | null
          title: string
          updated_at: string | null
          user_id: string
          verification_mode:
            | Database["public"]["Enums"]["verification_mode"]
            | null
        }
        Insert: {
          ai_generated?: boolean | null
          completion_percentage?: number | null
          created_at?: string | null
          days_completed?: number | null
          description?: string | null
          duration_days?: number | null
          end_date: string
          goal_type: Database["public"]["Enums"]["goal_type"]
          id?: string
          intensity_level?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["goal_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
          verification_mode?:
            | Database["public"]["Enums"]["verification_mode"]
            | null
        }
        Update: {
          ai_generated?: boolean | null
          completion_percentage?: number | null
          created_at?: string | null
          days_completed?: number | null
          description?: string | null
          duration_days?: number | null
          end_date?: string
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          intensity_level?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["goal_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          verification_mode?:
            | Database["public"]["Enums"]["verification_mode"]
            | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accuracy_percentage: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          id: string
          longest_streak: number | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_xp: number | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          accuracy_percentage?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          id: string
          longest_streak?: number | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_xp?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          accuracy_percentage?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          id?: string
          longest_streak?: number | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          total_xp?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_entries: {
        Row: {
          created_at: string | null
          date: string
          goal_id: string
          id: string
          notes: string | null
          task_id: string | null
          user_id: string
          verified: boolean | null
          xp_gained: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          goal_id: string
          id?: string
          notes?: string | null
          task_id?: string | null
          user_id: string
          verified?: boolean | null
          xp_gained?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          goal_id?: string
          id?: string
          notes?: string | null
          task_id?: string | null
          user_id?: string
          verified?: boolean | null
          xp_gained?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_entries_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          auto_renew: boolean | null
          created_at: string | null
          currency: string | null
          expires_at: string
          id: string
          payment_id: string | null
          payment_provider: string | null
          starts_at: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          auto_renew?: boolean | null
          created_at?: string | null
          currency?: string | null
          expires_at: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          starts_at: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          auto_renew?: boolean | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          goal_id: string
          id: string
          scheduled_date: string
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          user_id: string
          verification_data: Json | null
          verified: boolean | null
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal_id: string
          id?: string
          scheduled_date: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          user_id: string
          verification_data?: Json | null
          verified?: boolean | null
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal_id?: string
          id?: string
          scheduled_date?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          user_id?: string
          verification_data?: Json | null
          verified?: boolean | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          accuracy_percentage: number | null
          avatar_url: string | null
          current_streak: number | null
          display_name: string | null
          id: string | null
          rank: number | null
          total_xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      user_has_premium_access: {
        Args: { user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      goal_status: "active" | "completed" | "paused" | "abandoned"
      goal_type: "fitness" | "learning" | "exam" | "seasonal"
      subscription_tier: "free" | "premium"
      task_status: "pending" | "completed" | "skipped"
      verification_mode: "normal" | "strict"
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
      goal_status: ["active", "completed", "paused", "abandoned"],
      goal_type: ["fitness", "learning", "exam", "seasonal"],
      subscription_tier: ["free", "premium"],
      task_status: ["pending", "completed", "skipped"],
      verification_mode: ["normal", "strict"],
    },
  },
} as const
