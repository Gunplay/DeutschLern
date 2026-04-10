-- ============================================================
--  DEUTSCHLERN — Initial Database Schema
--  Run this in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  role        text not null default 'student' check (role in ('student', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- LEVELS
create table public.levels (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text not null unique,
  description     text not null default '',
  price           integer not null default 0,
  stripe_price_id text,
  color           text not null default 'from-brand-400 to-brand-600',
  order_index     integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- MODULES
create table public.modules (
  id          uuid primary key default uuid_generate_v4(),
  level_id    uuid not null references public.levels on delete cascade,
  title       text not null,
  description text,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- LESSONS
create table public.lessons (
  id               uuid primary key default uuid_generate_v4(),
  module_id        uuid not null references public.modules on delete cascade,
  title            text not null,
  description      text,
  content_type     text not null default 'text' check (content_type in ('video','text','audio','mixed')),
  video_url        text,
  content          text,
  duration_minutes integer not null default 10,
  order_index      integer not null default 0,
  is_preview       boolean not null default false,
  created_at       timestamptz not null default now()
);

-- QUESTIONS
create table public.questions (
  id             uuid primary key default uuid_generate_v4(),
  lesson_id      uuid not null references public.lessons on delete cascade,
  question       text not null,
  type           text not null default 'multiple_choice' check (type in ('multiple_choice','fill_blank','true_false','matching')),
  options        jsonb,
  correct_answer text not null,
  explanation    text,
  order_index    integer not null default 0
);

-- SUBSCRIPTIONS
create table public.subscriptions (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references public.profiles on delete cascade,
  level_id               uuid not null references public.levels on delete cascade,
  status                 text not null default 'active' check (status in ('active','expired','cancelled','pending')),
  stripe_subscription_id text,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  unique(user_id, level_id)
);

-- LESSON PROGRESS
create table public.lesson_progress (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.profiles on delete cascade,
  lesson_id             uuid not null references public.lessons on delete cascade,
  completed             boolean not null default false,
  progress_percent      integer not null default 0,
  last_position_seconds integer not null default 0,
  updated_at            timestamptz not null default now(),
  unique(user_id, lesson_id)
);

-- QUIZ ATTEMPTS
create table public.quiz_attempts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles on delete cascade,
  lesson_id       uuid not null references public.lessons on delete cascade,
  score           integer not null,
  total_questions integer not null,
  passed          boolean not null default false,
  answers         jsonb not null default '{}',
  completed_at    timestamptz not null default now()
);

-- VOCABULARY
create table public.vocabulary (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles on delete cascade,
  german      text not null,
  translation text not null,
  example     text,
  lesson_id   uuid references public.lessons on delete set null,
  learned     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- PAYMENTS
create table public.payments (
  id                       uuid primary key default uuid_generate_v4(),
  user_id                  uuid not null references public.profiles on delete cascade,
  level_id                 uuid not null references public.levels on delete cascade,
  amount                   integer not null,
  currency                 text not null default 'UAH',
  status                   text not null default 'pending' check (status in ('pending','succeeded','failed')),
  stripe_payment_intent_id text,
  created_at               timestamptz not null default now()
);

-- INDEXES
create index idx_modules_level_id     on public.modules(level_id);
create index idx_lessons_module_id    on public.lessons(module_id);
create index idx_questions_lesson_id  on public.questions(lesson_id);
create index idx_subscriptions_user   on public.subscriptions(user_id);
create index idx_lesson_progress_user on public.lesson_progress(user_id);
create index idx_vocabulary_user      on public.vocabulary(user_id);
create index idx_payments_user        on public.payments(user_id);

-- RLS
alter table public.profiles       enable row level security;
alter table public.levels         enable row level security;
alter table public.modules        enable row level security;
alter table public.lessons        enable row level security;
alter table public.questions      enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts  enable row level security;
alter table public.vocabulary     enable row level security;
alter table public.payments       enable row level security;

create policy "own_profile_select" on public.profiles for select using (auth.uid() = id);
create policy "own_profile_update" on public.profiles for update using (auth.uid() = id);
create policy "admin_profile_all"  on public.profiles for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "levels_public_read" on public.levels for select using (is_active = true);
create policy "levels_admin_all"   on public.levels for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "modules_public_read" on public.modules for select using (true);
create policy "modules_admin_all"   on public.modules for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "lessons_preview_read" on public.lessons for select using (is_preview = true);
create policy "lessons_subscribed"   on public.lessons for select using (
  exists (select 1 from public.subscriptions s join public.modules m on m.id = lessons.module_id
          where s.user_id = auth.uid() and s.level_id = m.level_id and s.status = 'active')
);
create policy "lessons_admin_all"    on public.lessons for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "questions_subscribed" on public.questions for select using (
  exists (select 1 from public.lessons l join public.modules m on m.id = l.module_id
          join public.subscriptions s on s.level_id = m.level_id
          where l.id = questions.lesson_id and s.user_id = auth.uid() and s.status = 'active')
);
create policy "questions_admin_all"  on public.questions for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "own_subscriptions"         on public.subscriptions for select using (auth.uid() = user_id);
create policy "admin_subscriptions_all"   on public.subscriptions for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "own_progress" on public.lesson_progress for all using (auth.uid() = user_id);
create policy "own_quiz"     on public.quiz_attempts   for all using (auth.uid() = user_id);
create policy "own_vocab"    on public.vocabulary      for all using (auth.uid() = user_id);

create policy "own_payments_select"   on public.payments for select using (auth.uid() = user_id);
create policy "admin_payments_all"    on public.payments for all using (exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- SEED: Level definitions
insert into public.levels (name, slug, description, price, order_index) values
  ('Початківець',      'A1', 'Базові слова та вітання. Числа, кольори, дні тижня.', 0,      1),
  ('Елементарний',     'A2', 'Повсякденне спілкування. Покупки, транспорт, сімя.', 89900,   2),
  ('Середній',         'B1', 'Робота, подорожі, новини. Складні діалоги.', 129900,          3),
  ('Вище середнього',  'B2', 'Аргументація, ЗМІ, академічний стиль.', 149900,              4),
  ('Просунутий',       'C1', 'Ділова мова та переговори.', 179900,                          5),
  ('Майстер',          'C2', 'Рівень носія. Литература та наукові тексти.', 199900,         6);
