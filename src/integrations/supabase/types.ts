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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_scores: {
        Row: {
          city: string
          created_at: string | null
          expires_at: string | null
          id: string
          product_name: string
          reasons: Json
          score: number
          verdict: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_name: string
          reasons?: Json
          score: number
          verdict?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_name?: string
          reasons?: Json
          score?: number
          verdict?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          topic: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          topic?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          category: string | null
          city: string
          created_at: string
          current_best_price: number | null
          current_best_seller: string | null
          id: string
          last_checked_at: string | null
          notify_email: boolean
          notify_whatsapp: boolean
          product_image: string | null
          product_name: string
          status: string
          target_price: number
          triggered_at: string | null
          updated_at: string
          user_id: string
          whatsapp_number: string | null
        }
        Insert: {
          category?: string | null
          city?: string
          created_at?: string
          current_best_price?: number | null
          current_best_seller?: string | null
          id?: string
          last_checked_at?: string | null
          notify_email?: boolean
          notify_whatsapp?: boolean
          product_image?: string | null
          product_name: string
          status?: string
          target_price: number
          triggered_at?: string | null
          updated_at?: string
          user_id: string
          whatsapp_number?: string | null
        }
        Update: {
          category?: string | null
          city?: string
          created_at?: string
          current_best_price?: number | null
          current_best_seller?: string | null
          id?: string
          last_checked_at?: string | null
          notify_email?: boolean
          notify_whatsapp?: boolean
          product_image?: string | null
          product_name?: string
          status?: string
          target_price?: number
          triggered_at?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          created_at: string
          delivery_available: boolean
          delivery_price: number
          description: string | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          is_active: boolean
          mrp: number
          name: string
          price: number
          prices: Json | null
          seller_id: string | null
          slug: string
          specs: Json | null
          status: string
          stock: number
          subcategory: string | null
          updated_at: string
          variants: Json | null
        }
        Insert: {
          brand?: string
          category?: string
          created_at?: string
          delivery_available?: boolean
          delivery_price?: number
          description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mrp?: number
          name: string
          price?: number
          prices?: Json | null
          seller_id?: string | null
          slug: string
          specs?: Json | null
          status?: string
          stock?: number
          subcategory?: string | null
          updated_at?: string
          variants?: Json | null
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          delivery_available?: boolean
          delivery_price?: number
          description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          mrp?: number
          name?: string
          price?: number
          prices?: Json | null
          seller_id?: string | null
          slug?: string
          specs?: Json | null
          status?: string
          stock?: number
          subcategory?: string | null
          updated_at?: string
          variants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_address: string | null
          business_owner_name: string | null
          city: string
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          is_admin: boolean
          language: string
          mobile: string | null
          mobile_verified: boolean
          msme_number: string | null
          name: string
          pan_number: string | null
          pin_code: string | null
          registration_complete: boolean
          role: string
          shop_category: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          business_address?: string | null
          business_owner_name?: string | null
          city?: string
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          is_admin?: boolean
          language?: string
          mobile?: string | null
          mobile_verified?: boolean
          msme_number?: string | null
          name?: string
          pan_number?: string | null
          pin_code?: string | null
          registration_complete?: boolean
          role?: string
          shop_category?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          business_address?: string | null
          business_owner_name?: string | null
          city?: string
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          is_admin?: boolean
          language?: string
          mobile?: string | null
          mobile_verified?: boolean
          msme_number?: string | null
          name?: string
          pan_number?: string | null
          pin_code?: string | null
          registration_complete?: boolean
          role?: string
          shop_category?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          city: string
          created_at: string | null
          id: string
          search_query: string
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          search_query: string
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          search_query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sellers: {
        Row: {
          banner_url: string | null
          category: string | null
          city: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          logo_url: string | null
          phone: string | null
          rating: number
          shop_name: string
          total_reviews: number
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          banner_url?: string | null
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logo_url?: string | null
          phone?: string | null
          rating?: number
          shop_name: string
          total_reviews?: number
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          banner_url?: string | null
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logo_url?: string | null
          phone?: string | null
          rating?: number
          shop_name?: string
          total_reviews?: number
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      sellers_public: {
        Row: {
          banner_url: string | null
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          rating: number | null
          shop_name: string | null
          total_reviews: number | null
        }
        Insert: {
          banner_url?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          rating?: number | null
          shop_name?: string | null
          total_reviews?: number | null
        }
        Update: {
          banner_url?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          rating?: number | null
          shop_name?: string | null
          total_reviews?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_seller_contact: {
        Args: { _seller_id: string }
        Returns: {
          phone: string
          whatsapp: string
        }[]
      }
      get_trending_searches: {
        Args: { p_city: string; p_days?: number }
        Returns: {
          count: number
          query: string
        }[]
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      profile_safe_update: {
        Args: { _is_admin: boolean; _role: string; _user_id: string }
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
    Enums: {},
  },
} as const
