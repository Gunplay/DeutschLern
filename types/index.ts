// ─── User & Auth ─────────────────────────────────────────
export type UserRole = "student" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ─── Courses ─────────────────────────────────────────────
export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Level {
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
}

export interface Module {
  id: string;
  level_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface Lesson {
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
}

// ─── Quiz ────────────────────────────────────────────────
export type QuestionType = "multiple_choice" | "fill_blank" | "true_false" | "matching";

export interface Question {
  id: string;
  lesson_id: string;
  question: string;
  type: QuestionType;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  order_index: number;
}

// ─── Progress ────────────────────────────────────────────
export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percent: number;
  last_position_seconds: number;
  updated_at: string;
}

// ─── Subscriptions & Payments ────────────────────────────
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export interface Subscription {
  id: string;
  user_id: string;
  level_id: string;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  level_id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  stripe_payment_intent_id: string | null;
  created_at: string;
}

// ─── Vocabulary ──────────────────────────────────────────
export interface VocabularyWord {
  id: string;
  user_id: string;
  german: string;
  translation: string;
  example: string | null;
  lesson_id: string | null;
  learned: boolean;
  created_at: string;
}

// ─── Navigation ──────────────────────────────────────────
export type NavIconName =
  | "LayoutDashboard"
  | "BookOpen"
  | "BookMarked"
  | "CreditCard"
  | "Users"
  | "BarChart3"
  | "Settings";

export interface NavItem {
  label: string;
  href: string;
  icon?: NavIconName;
  badge?: string | number;
}
