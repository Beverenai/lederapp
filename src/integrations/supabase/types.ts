export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cabins: {
        Row: {
          capacity: number
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      leader_imports: {
        Row: {
          activity: string | null
          cabin_responsibility: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          important_notice: string | null
          last_name: string | null
          notes: string | null
          phone: string | null
          processed: boolean | null
          task_assignment: string | null
          team: string | null
        }
        Insert: {
          activity?: string | null
          cabin_responsibility?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: number
          important_notice?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          processed?: boolean | null
          task_assignment?: string | null
          team?: string | null
        }
        Update: {
          activity?: string | null
          cabin_responsibility?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: number
          important_notice?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          processed?: boolean | null
          task_assignment?: string | null
          team?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity: string | null
          age: number | null
          avatar_url: string | null
          bio: string | null
          cabin_responsibility: string | null
          climbing_ability: string | null
          created_at: string
          email: string | null
          first_name: string | null
          has_boat_license: boolean | null
          has_car: boolean | null
          has_driving_license: boolean | null
          id: string
          important_notice: string | null
          last_name: string | null
          notes: string | null
          phone: string | null
          rappelling_ability: string | null
          role: string | null
          t_setting_ability: string | null
          task_assignment: string | null
          team: string | null
          updated_at: string
          zipline_ability: string | null
        }
        Insert: {
          activity?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          cabin_responsibility?: string | null
          climbing_ability?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_boat_license?: boolean | null
          has_car?: boolean | null
          has_driving_license?: boolean | null
          id: string
          important_notice?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          rappelling_ability?: string | null
          role?: string | null
          t_setting_ability?: string | null
          task_assignment?: string | null
          team?: string | null
          updated_at?: string
          zipline_ability?: string | null
        }
        Update: {
          activity?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          cabin_responsibility?: string | null
          climbing_ability?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_boat_license?: boolean | null
          has_car?: boolean | null
          has_driving_license?: boolean | null
          id?: string
          important_notice?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          rappelling_ability?: string | null
          role?: string | null
          t_setting_ability?: string | null
          task_assignment?: string | null
          team?: string | null
          updated_at?: string
          zipline_ability?: string | null
        }
        Relationships: []
      }
      role_assignments: {
        Row: {
          cabin_id: string | null
          created_at: string
          id: string
          task_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cabin_id?: string | null
          created_at?: string
          id?: string
          task_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cabin_id?: string | null
          created_at?: string
          id?: string
          task_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_assignments_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_users_from_imports: {
        Args: Record<PropertyKey, never>
        Returns: {
          activity: string | null
          cabin_responsibility: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          important_notice: string | null
          last_name: string | null
          notes: string | null
          phone: string | null
          processed: boolean | null
          task_assignment: string | null
          team: string | null
        }[]
      }
      delete_leader_imports: {
        Args: {
          leader_email: string
        }
        Returns: undefined
      }
      import_csv_to_leaders: {
        Args: {
          csv_text: string
        }
        Returns: {
          activity: string | null
          cabin_responsibility: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          important_notice: string | null
          last_name: string | null
          notes: string | null
          phone: string | null
          processed: boolean | null
          task_assignment: string | null
          team: string | null
        }[]
      }
      update_user_role: {
        Args: {
          user_id: string
          new_role: string
        }
        Returns: boolean
      }
      update_user_role_and_metadata: {
        Args: {
          user_id: string
          new_role: string
          meta_data: Json
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
