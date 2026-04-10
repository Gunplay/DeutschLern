import Link from "next/link";
import {
  ArrowRight,
  Star,
  CheckCircle2,
  Zap,
  Globe,
  BookOpen,
  Trophy,
  Users,
  Play,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LEVEL_COLORS, LEVEL_BG } from "@/constants";

const LEVELS = [
  {
    slug: "A1",
    name: "Початківець",
    desc: "Базові слова, вітання, числа",
    lessons: 24,
    price: "Безкоштовно",
  },
  {
    slug: "A2",
    name: "Елементарний",
    desc: "Повсякденне спілкування",
    lessons: 32,
    price: "899 ₴",
  },
  {
    slug: "B1",
    name: "Середній",
    desc: "Робота, подорожі, новини",
    lessons: 40,
    price: "1 299 ₴",
  },
  {
    slug: "B2",
    name: "Вище середнього",
    desc: "Складні теми та аргументи",
    lessons: 48,
    price: "1 499 ₴",
  },
  {
    slug: "C1",
    name: "Просунутий",
    desc: "Академічна та ділова мова",
    lessons: 52,
    price: "1 799 ₴",
  },
  {
    slug: "C2",
    name: "Досконалий",
    desc: "Рівень носія мови",
    lessons: 60,
    price: "1 999 ₴",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Інтерактивні уроки",
    desc: "Відео, аудіо та вправи в одному місці",
  },
  {
    icon: BookOpen,
    title: "Словниковий тренажер",
    desc: "Flashcards з інтервальним повторенням",
  },
  {
    icon: Trophy,
    title: "Тести після кожного модуля",
    desc: "Автоматична перевірка з поясненнями",
  },
  {
    icon: Globe,
    title: "Доступ з будь-якого пристрою",
    desc: "PWA — як додаток на телефоні",
  },
  { icon: Users, title: "Жива спільнота", desc: "Форум та підтримка викладача" },
  { icon: Star, title: "Сертифікат по завершенню", desc: "PDF-сертифікат для резюме" },
];

const TESTIMONIALS = [
  {
    name: "Оксана К.",
    level: "B1",
    text: "За 6 місяців дійшла до B1. Уроки дуже структуровані!",
    avatar: "О",
  },
  {
    name: "Михайло Д.",
    level: "A2",
    text: "Найкраща платформа для вивчення мови. Зручно з телефону.",
    avatar: "М",
  },
  {
    name: "Наталія В.",
    level: "C1",
    text: "Здала DSH з першого разу! Дякую DeutschLern.",
    avatar: "Н",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-24 pt-32">
        {/* Background */}
        <div className="bg-mesh pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-400/5 blur-3xl" />

        <div className="page-container relative text-center">
          <Badge variant="secondary" className="mb-6 inline-flex gap-2 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Новий рівень B2 вже доступний
          </Badge>

          <h1 className="mx-auto mb-6 max-w-4xl font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Вивчай <span className="gradient-text">німецьку</span> так, ніби вже живеш у
            Берліні
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Інтерактивні уроки від A1 до C2, тести, словниковий тренажер та сертифікати.
            Все, що потрібно — в одному місці.
          </p>

          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" asChild className="group w-full sm:w-auto">
              <Link href="/register">
                Почати безкоштовно
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="xl" variant="glass" asChild className="w-full gap-3 sm:w-auto">
              <Link href="#demo">
                <Play className="h-4 w-4 text-primary" />
                Переглянути демо
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["А", "Б", "В", "Г"].map((l) => (
                  <div
                    key={l}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span>
                <strong className="text-foreground">2 400+</strong> студентів
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              <span>
                <strong className="text-foreground">4.9</strong> рейтинг
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-500" />
              <span>Сертифікат по завершенню</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Levels / Pricing ─────────────────────────────── */}
      <section id="pricing" className="bg-secondary/30 py-24">
        <div className="page-container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Курси
            </Badge>
            <h2 className="mb-4 font-display text-4xl font-bold sm:text-5xl">
              Оберіть свій рівень
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Від нульового до рівня носія мови. Кожен рівень — окремий курс з
              відеоуроками та тестами.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((level) => (
              <div key={level.slug} className="bento-card group relative overflow-hidden">
                {level.slug === "A1" && (
                  <div className="absolute right-4 top-4">
                    <Badge variant="success">Безкоштовно</Badge>
                  </div>
                )}
                <div
                  className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${LEVEL_BG[level.slug]}`}
                >
                  {level.slug}
                </div>
                <h3 className="mb-2 font-display text-xl font-bold">{level.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{level.desc}</p>
                <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{level.lessons} уроків</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">{level.price}</span>
                  <Button
                    size="sm"
                    variant={level.slug === "A1" ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">
                      {level.slug === "A1" ? "Почати" : "Придбати"}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                {/* gradient bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${LEVEL_COLORS[level.slug]} opacity-60 transition-opacity group-hover:opacity-100`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Можливості
            </Badge>
            <h2 className="mb-4 font-display text-4xl font-bold sm:text-5xl">
              Все, що потрібно для прогресу
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bento-card">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────── */}
      <section className="bg-secondary/30 py-24">
        <div className="page-container">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Відгуки
            </Badge>
            <h2 className="mb-4 font-display text-4xl font-bold">Що кажуть студенти</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bento-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <Badge className={`text-xs ${LEVEL_BG[t.level]}`}>{t.level}</Badge>
                  </div>
                </div>
                <div className="mb-3 flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container text-center">
          <div className="glass relative overflow-hidden rounded-3xl p-12 sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-500/5" />
            <h2 className="relative mb-6 font-display text-4xl font-bold sm:text-5xl">
              Готовий почати свій шлях?
            </h2>
            <p className="relative mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
              Рівень A1 — повністю безкоштовно. Жодної кредитної картки.
            </p>
            <Button size="xl" asChild className="group relative">
              <Link href="/register">
                Зареєструватись безкоштовно
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
