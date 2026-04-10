# 🎓 DeutschLern — Платформа для вивчення німецької мови

> Production-ready fullstack додаток | Next.js 14 + Supabase + Stripe

---

## 📋 ЗМІСТ

1. [Що це за проект](#що-це-за-проект)
2. [Технологічний стек](#технологічний-стек)
3. [Структура проекту](#структура-проекту)
4. [Документація для підтримки](#документація-для-підтримки)
5. [КРОК 1 — Встановлення Node.js](#крок-1--встановлення-nodejs)
6. [КРОК 2 — Встановлення VS Code](#крок-2--встановлення-vs-code)
7. [КРОК 3 — Завантаження проекту](#крок-3--завантаження-проекту)
8. [КРОК 4 — Supabase (База даних)](#крок-4--supabase-база-даних)
9. [КРОК 5 — Stripe (Оплата)](#крок-5--stripe-оплата)
10. [КРОК 6 — Налаштування змінних оточення](#крок-6--налаштування-змінних-оточення)
11. [КРОК 7 — Запуск проекту](#крок-7--запуск-проекту)
12. [КРОК 8 — Деплой на Vercel](#крок-8--деплой-на-vercel)
13. [Як користуватись адмін-панеллю](#як-користуватись-адмін-панеллю)
14. [Часті помилки та їх вирішення](#часті-помилки-та-їх-вирішення)

---

## Що це за проект

DeutschLern — це повноцінна освітня платформа з:

- 🏠 **Лендінг** з описом курсів і цінами
- 👤 **Авторизація** (email + Google)
- 📚 **Система курсів** (6 рівнів: A1–C2)
- 🎬 **Відеоплеєр** зі збереженням прогресу
- 📝 **Тести** після кожного уроку
- 📖 **Словниковий тренажер** (Flashcards)
- 💳 **Оплата** через Stripe
- 🔐 **Адмін-панель** для керування контентом

---

## Технологічний стек

| Шар        | Технологія     | Призначення                |
| ---------- | -------------- | -------------------------- |
| Frontend   | Next.js 14     | UI + Server-side rendering |
| Мова       | TypeScript     | Типізація, менше багів     |
| Стилі      | Tailwind CSS   | Швидка стилізація          |
| БД + Auth  | Supabase       | PostgreSQL + авторизація   |
| Стан даних | TanStack Query | Кешування запитів          |
| Оплата     | Stripe         | Платіжна система           |
| Анімації   | Framer Motion  | Плавні переходи            |
| Деплой     | Vercel         | Безкоштовний хостинг       |

---

## Структура проекту

```
deutschlern/
│
├── app/                        ← Всі сторінки (Next.js App Router)
│   ├── (auth)/                 ← Група: сторінки авторизації
│   │   ├── login/page.tsx      ← Сторінка входу
│   │   └── register/page.tsx   ← Сторінка реєстрації
│   ├── (dashboard)/            ← Група: сторінки студента
│   │   ├── dashboard/page.tsx  ← Головний дашборд
│   │   ├── courses/page.tsx    ← Каталог курсів
│   │   ├── vocabulary/page.tsx ← Словник
│   │   └── billing/page.tsx    ← Оплата
│   ├── (admin)/                ← Група: адмін-панель
│   │   └── admin/
│   │       ├── page.tsx        ← Адмін-дашборд
│   │       ├── courses/page.tsx← Управління курсами
│   │       └── users/page.tsx  ← Список студентів
│   ├── api/                    ← Backend API
│   │   ├── auth/callback/      ← OAuth callback
│   │   ├── stripe/checkout/    ← Створення платежу
│   │   ├── stripe/webhook/     ← Stripe webhook
│   │   └── progress/           ← Збереження прогресу
│   ├── layout.tsx              ← Кореневий layout (теми, шрифти)
│   ├── page.tsx                ← Лендінг (головна сторінка)
│   └── globals.css             ← Глобальні стилі
│
├── components/
│   ├── ui/                     ← Базові UI-компоненти (button, card...)
│   └── shared/                 ← Спільні компоненти (navbar, sidebar...)
│
├── features/                   ← Функціональні модулі
│   ├── auth/                   ← Форми входу / реєстрації
│   ├── courses/                ← Відеоплеєр, адмін-курси
│   ├── quiz/                   ← Рушій тестів
│   ├── vocabulary/             ← Флеш-картки
│   └── payments/               ← Кнопка оплати
│
├── lib/
│   ├── supabase/               ← Клієнти Supabase (browser + server)
│   ├── stripe/                 ← Stripe клієнти
│   └── utils.ts                ← Допоміжні функції
│
├── types/index.ts              ← Всі TypeScript типи
├── constants/index.ts          ← Константи (навігація, ціни...)
├── middleware.ts               ← Захист маршрутів (auth guard)
├── supabase/migrations/        ← SQL схема та seed-дані
└── .env.example                ← Приклад змінних оточення
```

---

## Документація для підтримки

- `docs/ARCHITECTURE.md` — **архітектура**, правила модулів, де що лежить
- `docs/RUNBOOK.md` — **запуск/деплой/інциденти** (що робити крок за кроком)

---

## КРОК 1 — Встановлення Node.js

> Node.js — це середовище для запуску JavaScript. Без нього проект не запуститься.

### Windows:

1. Відкрий браузер і зайди на https://nodejs.org
2. Натисни велику зелену кнопку **"LTS"** (рекомендована версія)
3. Завантажиться файл типу `node-v20.x.x-x64.msi`
4. Запусти його → Next → Next → Install
5. Перевір встановлення: відкрий **Командний рядок** (Win + R → cmd → Enter)
   ```
   node --version
   ```
   Повинно показати щось на кшталт: `v20.15.0`

### macOS:

```bash
# Якщо є Homebrew (рекомендовано):
brew install node

# Або завантаж з nodejs.org
```

---

## КРОК 2 — Встановлення VS Code

1. Зайди на https://code.visualstudio.com
2. Натисни **"Download for Windows"** (або macOS)
3. Встанови як звичайну програму
4. Рекомендовані розширення VS Code (встанови після запуску):
   - **Tailwind CSS IntelliSense** — підказки для класів
   - **TypeScript Importer** — авто-імпорти
   - **Prettier** — форматування коду
   - **ES7+ React Snippets** — швидкі шаблони

---

## КРОК 3 — Завантаження проекту

```bash
# 1. Відкрий термінал (у VS Code: Ctrl + ` або View → Terminal)

# 2. Перейди в папку де хочеш зберегти проект
cd Desktop    # або cd Documents

# 3. Клонуй або скопіюй папку deutschlern туди

# 4. Перейди в папку проекту
cd deutschlern

# 5. Встанови всі залежності (це займе 1-2 хвилини)
npm install
```

---

## КРОК 4 — Supabase (База даних)

Supabase — це безкоштовний хмарний PostgreSQL. Тут зберігатимуться всі дані.

### 4.1 Створення акаунту

1. Зайди на https://supabase.com
2. Натисни **"Start your project"**
3. Зареєструйся через GitHub (або email)

### 4.2 Створення проекту

1. Натисни **"New project"**
2. Заповни:
   - **Organization**: твоя організація (або створи нову — безкоштовно)
   - **Project name**: `deutschlern`
   - **Database password**: придумай надійний пароль — **збережи його!**
   - **Region**: `EU Central (Frankfurt)` — найближче до України
3. Натисни **"Create new project"** — чекай ~2 хвилини

### 4.3 Запуск SQL схеми

1. У Supabase → лівий сайдбар → **"SQL Editor"**
2. Натисни **"New query"**
3. Відкрий файл `supabase/migrations/001_initial_schema.sql` у VS Code
4. Скопіюй весь вміст (Ctrl+A → Ctrl+C)
5. Встав у SQL Editor Supabase (Ctrl+V)
6. Натисни **"Run"** (зелена кнопка)
7. Повинно з'явитись: `Success. No rows returned`

8. Повтори те саме для файлу `supabase/migrations/002_seed_a1.sql`
   (це додасть тестові уроки для рівня A1)

### 4.4 Налаштування Google авторизації (необов'язково, але рекомендовано)

1. Supabase → **Authentication** → **Providers**
2. Знайди **Google** → увімкни
3. Тобі потрібен Google OAuth Client ID. Як отримати:
   - Зайди на https://console.cloud.google.com
   - Створи проект → APIs & Services → Credentials → Create OAuth 2.0 Client
   - Authorized redirect URIs: `https://xxxx.supabase.co/auth/v1/callback`
   - Скопіюй Client ID та Client Secret → встав у Supabase
4. Натисни **Save**

### 4.5 Отримання ключів API

1. Supabase → лівий сайдбар → **Settings** → **API**
2. Знайди та збережи:
   - **Project URL** — виглядає як `https://abcdefgh.supabase.co`
   - **anon public** — довгий рядок, починається з `eyJ...`
   - **service_role** → натисни "Reveal" → теж починається з `eyJ...`

   ⚠️ **service_role key** — ДУЖЕ секретний! Ніколи не додавай в Git!

---

## КРОК 5 — Stripe (Оплата)

> Stripe — міжнародна платіжна система. Підтримує карти Visa/MasterCard.

### 5.1 Реєстрація

1. Зайди на https://stripe.com
2. Зареєструйся (можна з українськими даними)
3. Залишайся в **Test mode** (перемикач вгорі праворуч)

### 5.2 Отримання ключів

1. Stripe Dashboard → **Developers** → **API keys**
2. Збережи:
   - **Publishable key** — починається з `pk_test_...`
   - **Secret key** → "Reveal test key" → починається з `sk_test_...`

### 5.3 Налаштування Webhook (для локальної розробки)

Webhook — це повідомлення від Stripe про успішний платіж.

```bash
# Встанови Stripe CLI
# Windows: завантаж з https://github.com/stripe/stripe-cli/releases
# macOS:
brew install stripe/stripe-cli/stripe

# Авторизуйся
stripe login

# Запусти прослуховування (в окремому терміналі, паралельно з npm run dev)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Stripe CLI покаже рядок типу:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Збережи цей `whsec_...` — він потрібен для `.env.local`

---

## КРОК 6 — Налаштування змінних оточення

1. У папці проекту знайди файл `.env.example`
2. Скопіюй його та назви `.env.local`:

   ```bash
   # Windows (в терміналі VS Code):
   copy .env.example .env.local

   # macOS/Linux:
   cp .env.example .env.local
   ```

3. Відкрий `.env.local` у VS Code та заповни:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://твій-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (anon public key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (service_role key)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DeutschLern
```

⚠️ **Важливо:** `.env.local` вже є в `.gitignore` — він НЕ потрапить в Git. Це правильно!

---

## КРОК 7 — Запуск проекту

```bash
# Переконайся що ти в папці проекту
cd deutschlern

# Запуск в режимі розробки
npm run dev
```

Побачиш:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 2.1s
```

Відкрий браузер: **http://localhost:3000** 🎉

### Корисні команди:

```bash
npm run dev        # Запуск для розробки (з hot-reload)
npm run build      # Збірка для продакшену
npm run start      # Запуск зібраного продакшену
npm run lint       # Перевірка коду на помилки
npm run type-check # Перевірка TypeScript типів
npm run format     # Авто-форматування коду (Prettier)
npm run format:check # Перевірка форматування (CI-friendly)
```

### Як зробити себе адміном:

1. Зареєструйся через сайт
2. Зайди в Supabase → **Table Editor** → таблиця `profiles`
3. Знайди свій рядок → клікни на поле `role` → зміни на `admin`
4. Тепер у тебе є доступ до `/admin`

---

## КРОК 8 — Деплой на Vercel

Vercel — безкоштовний хостинг для Next.js проектів.

### 8.1 Підготовка

```bash
# Встанови Git якщо немає
# https://git-scm.com/downloads

# Ініціалізуй репозиторій
git init
git add .
git commit -m "Initial commit"

# Створи акаунт на GitHub та новий репозиторій
# Завантаж туди проект
git remote add origin https://github.com/твій-юзернейм/deutschlern.git
git push -u origin main
```

### 8.2 Підключення до Vercel

1. Зайди на https://vercel.com → Sign Up через GitHub
2. **"New Project"** → знайди репозиторій `deutschlern` → **"Import"**
3. Розгорни розділ **"Environment Variables"**
4. Додай всі змінні з `.env.local` (по одній)
5. Натисни **"Deploy"**

### 8.3 Після деплою — налаштування Stripe Webhook для продакшену

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://твій-домен.vercel.app/api/stripe/webhook`
3. Events: обери `checkout.session.completed`
4. Отримай новий `whsec_...` → додай в Vercel Environment Variables

---

## Як користуватись адмін-панеллю

### Доступ

Зайди на `/admin` (тільки з роллю `admin`).

### Додавання контенту

**Шлях: /admin/courses**

1. Знайди потрібний рівень (наприклад A2)
2. Клікни по ньому → розкриється список модулів
3. Натисни **"+ Урок"** поруч з модулем
4. Заповни: назва, тип (video/text), тривалість
5. Натисни **"Зберегти"**

### Додавання відео

Відео зберігаються в Supabase Storage:

1. Supabase → **Storage** → **"New bucket"** → назви `videos`, увімкни **Public**
2. Завантаж відео → скопіюй URL
3. В Supabase SQL Editor:
   ```sql
   update lessons
   set video_url = 'https://твій.supabase.co/storage/v1/object/public/videos/урок.mp4',
       content_type = 'video'
   where id = 'uuid-уроку';
   ```

### Додавання питань до тесту

В Supabase SQL Editor:

```sql
insert into questions (lesson_id, question, type, options, correct_answer, explanation, order_index)
values (
  'uuid-уроку',
  'Як перекладається "danke"?',
  'multiple_choice',
  '["Будь ласка", "Дякую", "Вибач", "Привіт"]',
  'Дякую',
  'danke = дякую по-німецьки',
  1
);
```

---

## Часті помилки та їх вирішення

### ❌ `Error: supabaseUrl is required`

**Причина:** Не заповнені змінні оточення
**Рішення:** Перевір файл `.env.local` — всі рядки мають бути заповнені (без пробілів)

### ❌ `Error: Cannot find module 'xxx'`

**Причина:** Не встановлені залежності
**Рішення:**

```bash
rm -rf node_modules
npm install
```

### ❌ Сторінка не завантажується / 404

**Причина:** Проект не запущено
**Рішення:** Переконайся що в терміналі запущено `npm run dev`

### ❌ Помилка авторизації Google

**Причина:** Неправильно налаштований OAuth redirect URI
**Рішення:** В Google Console → Authorized redirect URIs додай:

- `http://localhost:3000/api/auth/callback` (для локальної розробки)
- `https://твій-домен.vercel.app/api/auth/callback` (для продакшену)

### ❌ Stripe Webhook error 400

**Причина:** Неправильний `STRIPE_WEBHOOK_SECRET`
**Рішення:** Перевір що запущений `stripe listen` і скопійований правильний `whsec_...`

### ❌ TypeScript помилки в VS Code

**Рішення:**

```bash
npm run type-check
```

Якщо помилок немає — можна запускати. VS Code іноді "ловить" помилки яких немає.

---

## 📞 Підтримка

- Supabase документація: https://supabase.com/docs
- Next.js документація: https://nextjs.org/docs
- Stripe тест-картки: https://stripe.com/docs/testing#cards
  - Успішна: `4242 4242 4242 4242` (будь-яка дата, CVC)

---

_DeutschLern v1.0 — Зроблено з ❤️ для українських студентів_
