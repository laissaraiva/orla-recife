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
      beach_likes: {
        Row: {
          beach_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          beach_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          beach_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      beach_status_notifications: {
        Row: {
          beach_id: string
          id: string
          new_status: Database["public"]["Enums"]["beach_status"]
          notified_at: string
          old_status: Database["public"]["Enums"]["beach_status"]
        }
        Insert: {
          beach_id: string
          id?: string
          new_status: Database["public"]["Enums"]["beach_status"]
          notified_at?: string
          old_status: Database["public"]["Enums"]["beach_status"]
        }
        Update: {
          beach_id?: string
          id?: string
          new_status?: Database["public"]["Enums"]["beach_status"]
          notified_at?: string
          old_status?: Database["public"]["Enums"]["beach_status"]
        }
        Relationships: [
          {
            foreignKeyName: "beach_status_notifications_beach_id_fkey"
            columns: ["beach_id"]
            isOneToOne: false
            referencedRelation: "beaches"
            referencedColumns: ["id"]
          },
        ]
      }
      beaches: {
        Row: {
          amenities: string[] | null
          coliform_level: Database["public"]["Enums"]["coliform_level"] | null
          coordinates_lat: number
          coordinates_lng: number
          created_at: string
          description: string | null
          id: string
          last_update: string
          name: string
          neighborhood: string
          shark_risk: Database["public"]["Enums"]["shark_risk"] | null
          status: Database["public"]["Enums"]["beach_status"]
          updated_at: string
          water_temperature: number | null
          wave_height: number | null
        }
        Insert: {
          amenities?: string[] | null
          coliform_level?: Database["public"]["Enums"]["coliform_level"] | null
          coordinates_lat: number
          coordinates_lng: number
          created_at?: string
          description?: string | null
          id?: string
          last_update?: string
          name: string
          neighborhood: string
          shark_risk?: Database["public"]["Enums"]["shark_risk"] | null
          status?: Database["public"]["Enums"]["beach_status"]
          updated_at?: string
          water_temperature?: number | null
          wave_height?: number | null
        }
        Update: {
          amenities?: string[] | null
          coliform_level?: Database["public"]["Enums"]["coliform_level"] | null
          coordinates_lat?: number
          coordinates_lng?: number
          created_at?: string
          description?: string | null
          id?: string
          last_update?: string
          name?: string
          neighborhood?: string
          shark_risk?: Database["public"]["Enums"]["shark_risk"] | null
          status?: Database["public"]["Enums"]["beach_status"]
          updated_at?: string
          water_temperature?: number | null
          wave_height?: number | null
        }
        Relationships: []
      }
      news: {
        Row: {
          category: Database["public"]["Enums"]["news_category"]
          created_at: string
          id: string
          image_url: string | null
          published_at: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["news_category"]
          created_at?: string
          id?: string
          image_url?: string | null
          published_at?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["news_category"]
          created_at?: string
          id?: string
          image_url?: string | null
          published_at?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      beach_status: "safe" | "warning" | "danger"
      coliform_level: "normal" | "elevated" | "high"
      news_category: "alert" | "news" | "weather"
      shark_risk: "low" | "medium" | "high"
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
      beach_status: ["safe", "warning", "danger"],
      coliform_level: ["normal", "elevated", "high"],
      news_category: ["alert", "news", "weather"],
      shark_risk: ["low", "medium", "high"],
    },
  },
} as const
