# DeutschLern Runbook (запуск і підтримка)

Це практичний гайд “що робити”, якщо ти:

- запускаєш проєкт вперше
- підключаєш Supabase/Stripe
- деплоїш на Vercel
- ловиш типові помилки

## 0) Вимоги

- Node.js **LTS** (рекомендовано 20+)
- npm (йде разом із Node)
- акаунти: Supabase, Stripe (test mode), Vercel (для деплою)

## 1) Встановлення залежностей

```bash
npm install
```

## 2) Environment variables

1. Скопіюй `.env.example` → `.env.local`

### Мінімально необхідні змінні

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (секретний, ніколи не коміть)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

## 3) Supabase: міграції

У Supabase → **SQL Editor** виконай SQL з файлів у `supabase/migrations/` (по черзі).

## 4) Stripe: webhook локально

Запусти в окремому терміналі:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Скопіюй `whsec_...` в `STRIPE_WEBHOOK_SECRET`.

## 5) Запуск

```bash
npm run dev
```

Відкрий `http://localhost:3000`.

## 6) Перевірки перед деплоєм

```bash
npm run lint
npm run type-check
npm run build
```

## 7) Деплой на Vercel (коротко)

- Імпортуй репозиторій у Vercel
- Додай всі змінні з `.env.local` в Environment Variables (Production)
- Додай Stripe webhook endpoint на:
  - `https://<твій-домен>/api/stripe/webhook`
  - event: `checkout.session.completed`

## 8) Типові інциденти

### `supabaseUrl is required`

- Перевір `.env.local`
- Перезапусти `npm run dev` після змін env

### Stripe webhook 400

- `STRIPE_WEBHOOK_SECRET` не той (перевір `stripe listen`)
- Перевір що endpoint збігається: `/api/stripe/webhook`

### 403 на `/admin`

- В `profiles.role` має бути `admin`
