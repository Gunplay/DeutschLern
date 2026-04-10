import type { NavItem } from "@/types";

export const APP_NAME = "DeutschLern";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const LEVEL_COLORS: Record<string, string> = {
  A1: "from-blue-500 to-cyan-500",
  A2: "from-green-500 to-emerald-500",
  B1: "from-yellow-500 to-orange-500",
  B2: "from-orange-500 to-red-500",
  C1: "from-purple-500 to-violet-500",
  C2: "from-pink-500 to-rose-500",
};

export const LEVEL_BG: Record<string, string> = {
  A1: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  A2: "bg-green-500/10 text-green-400 border-green-500/20",
  B1: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  B2: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  C1: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  C2: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export const STUDENT_NAV: NavItem[] = [
  { label: "Дашборд", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Курси", href: "/courses", icon: "BookOpen" },
  { label: "Курси безкоштовні", href: "/add", icon: "BookOpen" },
  { label: "Словник", href: "/vocabulary", icon: "BookMarked" },
  { label: "Оплата", href: "/billing", icon: "CreditCard" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Дашборд", href: "/admin", icon: "LayoutDashboard" },
  { label: "Курси", href: "/admin/courses", icon: "BookOpen" },
  { label: "Користувачі", href: "/admin/users", icon: "Users" },
  { label: "Аналітика", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Налаштування", href: "/admin/settings", icon: "Settings" },
];

export const QUIZ_PASS_THRESHOLD = 70;
export const ITEMS_PER_PAGE = 20;
