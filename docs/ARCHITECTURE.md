# DeutschLern Architecture (2026-ready)

Цей документ пояснює, **як влаштований проєкт**, де що лежить, і які правила допомагають підтримувати платформу **одному розробнику** без хаосу.

## Цілі архітектури

- **Проста навігація по коду**: відкрив VS Code → одразу зрозуміло де UI, де бізнес-логіка, де інтеграції.
- **Feature-first** там, де це корисно: “auth / courses / payments / quiz / vocabulary”.
- **Надійні інтеграції**: Supabase (Postgres/Auth/Storage) + Stripe (billing).
- **Мінімум магії**: прозорі правила імпортів та межі модулів.

## Карта шарів (Layers)

- **`app/`**: маршрути Next.js (App Router), layouts, server components, API routes.
- **`features/`**: бізнес-фічі (UI + hooks), які можна переносити/тестувати окремо.
- **`components/`**: спільні компоненти (shared) і базові UI primitives (ui).
- **`lib/`**: клієнти/SDK та інфраструктура (Supabase/Stripe) + загальні утиліти.
- **`constants/`**: константи продукту (навігація, пороги, ліміти).
- **`types/`**: доменні типи/інтерфейси (контракти між шарами).
- **`supabase/`**: міграції/SQL (джерело правди для схеми).

## Правила розміщення коду

### `app/` (routing)

- **Сторінки**: `app/**/page.tsx`
- **Layout**: `app/**/layout.tsx`
- **API**: `app/api/**/route.ts`
- **Групи**: `(auth)`, `(dashboard)`, `(admin)` — для структури без впливу на URL.

### `features/<feature>/`

Рекомендована структура всередині фічі:

- `features/<feature>/components/` — UI фічі (форми, списки, карточки)
- `features/<feature>/hooks/` — hooks для data-fetching/станів/взаємодії

Правило: **фіча не має імпортувати іншу фічу напряму** (щоб не було циклів).
Якщо треба — виносимо спільне в `components/shared` або `lib`.

### `lib/`

- `lib/supabase/` — клієнти Supabase для browser/server, helpers для auth.
- `lib/stripe/` — Stripe SDK, helpers для checkout/webhook.
- `lib/utils.ts` — дрібні утиліти без прив’язки до фіч (format, cn, etc).

Правило: `lib/` **не** залежить від `app/` (інакше буде “павутина”).

## Авторизація та доступи

- **Route guards**: `middleware.ts`
  - protected: `/dashboard`, `/courses`, `/vocabulary`, `/billing`
  - admin: `/admin/**`
  - auth: `/login`, `/register`

Роль адміна зберігається у Supabase таблиці `profiles.role`.

## Stripe інтеграція (коротко)

- Створення checkout: `app/api/stripe/checkout/route.ts`
- Вхідні події: `app/api/stripe/webhook/route.ts`

Ключова вимога: **webhook secret** має бути заданий (`STRIPE_WEBHOOK_SECRET`).

## Supabase (коротко)

- Міграції: `supabase/migrations/`
- Ключі: `.env.local` (див. `.env.example`)

## Конвенції імпортів

Використовуємо alias `@/*` з `tsconfig.json`:

- `@/components/...`
- `@/features/...`
- `@/lib/...`
- `@/types`

## Стандарти якості

- **Типи**: `npm run type-check`
- **Lint**: `npm run lint`
- **Форматування**: `npm run format` (Prettier + Tailwind plugin)
