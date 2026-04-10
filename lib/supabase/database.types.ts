// ============================================================
//  Auto-generated Supabase Database Types
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "student" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          updated_at?: string;
        };
        Relationships: [];
      };
      levels: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          stripe_price_id: string | null;
          color: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string;
          price?: number;
          stripe_price_id?: string | null;
          color?: string;
          order_index?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string;
          price?: number;
          stripe_price_id?: string | null;
          color?: string;
          order_index?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          level_id: string;
          title: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          level_id: string;
          title: string;
          description?: string | null;
          order_index?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          order_index?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          content_type: "video" | "text" | "audio" | "mixed";
          video_url: string | null;
          content: string | null;
          duration_minutes: number;
          order_index: number;
          is_preview: boolean;
          created_at: string;
        };
        Insert: {
          module_id: string;
          title: string;
          description?: string | null;
          content_type?: "video" | "text" | "audio" | "mixed";
          video_url?: string | null;
          content?: string | null;
          duration_minutes?: number;
          order_index?: number;
          is_preview?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          content_type?: "video" | "text" | "audio" | "mixed";
          video_url?: string | null;
          content?: string | null;
          duration_minutes?: number;
          order_index?: number;
          is_preview?: boolean;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          lesson_id: string;
          question: string;
          type: "multiple_choice" | "fill_blank" | "true_false" | "matching";
          options: Json | null;
          correct_answer: string;
          explanation: string | null;
          order_index: number;
        };
        Insert: {
          lesson_id: string;
          question: string;
          type?: "multiple_choice" | "fill_blank" | "true_false" | "matching";
          options?: Json | null;
          correct_answer: string;
          explanation?: string | null;
          order_index?: number;
        };
        Update: {
          question?: string;
          type?: "multiple_choice" | "fill_blank" | "true_false" | "matching";
          options?: Json | null;
          correct_answer?: string;
          explanation?: string | null;
          order_index?: number;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          level_id: string;
          status: "active" | "expired" | "cancelled" | "pending";
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          level_id: string;
          status?: "active" | "expired" | "cancelled" | "pending";
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
        };
        Update: {
          status?: "active" | "expired" | "cancelled" | "pending";
          current_period_end?: string | null;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          progress_percent: number;
          last_position_seconds: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          progress_percent?: number;
          last_position_seconds?: number;
          updated_at?: string;
        };
        Update: {
          completed?: boolean;
          progress_percent?: number;
          last_position_seconds?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          score: number;
          total_questions: number;
          passed: boolean;
          answers: Json;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          score: number;
          total_questions: number;
          passed?: boolean;
          answers?: Json;
          completed_at?: string;
        };
        Update: {
          score?: number;
          passed?: boolean;
          answers?: Json;
        };
        Relationships: [];
      };
      vocabulary: {
        Row: {
          id: string;
          user_id: string;
          german: string;
          translation: string;
          example: string | null;
          lesson_id: string | null;
          learned: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          german: string;
          translation: string;
          example?: string | null;
          lesson_id?: string | null;
          learned?: boolean;
        };
        Update: {
          translation?: string;
          example?: string | null;
          learned?: boolean;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          level_id: string;
          amount: number;
          currency: string;
          status: "pending" | "succeeded" | "failed";
          stripe_payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          level_id: string;
          amount: number;
          currency?: string;
          status?: "pending" | "succeeded" | "failed";
          stripe_payment_intent_id?: string | null;
        };
        Update: {
          status?: "pending" | "succeeded" | "failed";
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
