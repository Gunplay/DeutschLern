-- ============================================================
--  DEUTSCHLERN — Seed: A1 Level Content
-- ============================================================

-- Get the A1 level id
do $$
declare
  v_level_id   uuid;
  v_module1_id uuid;
  v_module2_id uuid;
  v_lesson1_id uuid;
  v_lesson2_id uuid;
  v_lesson3_id uuid;
  v_lesson4_id uuid;
begin
  select id into v_level_id from public.levels where slug = 'A1';

  -- Module 1
  insert into public.modules (level_id, title, description, order_index)
  values (v_level_id, 'Привітання та знайомство', 'Як представитися та привітатись', 1)
  returning id into v_module1_id;

  -- Lessons Module 1
  insert into public.lessons (module_id, title, description, content_type, duration_minutes, order_index, is_preview, content)
  values (v_module1_id, 'Hallo und Tschüss — Привіт та бувай', 'Перший урок: базові привітання', 'text', 10, 1, true,
    '<h2>Привітання</h2><p><strong>Hallo</strong> — Привіт (неформально)<br><strong>Guten Morgen</strong> — Доброго ранку<br><strong>Guten Tag</strong> — Добрий день<br><strong>Guten Abend</strong> — Добрий вечір<br><strong>Tschüss</strong> — Бувай<br><strong>Auf Wiedersehen</strong> — До побачення</p>')
  returning id into v_lesson1_id;

  insert into public.lessons (module_id, title, description, content_type, duration_minutes, order_index, is_preview, content)
  values (v_module1_id, 'Ich heiße... — Мене звати...', 'Як представитися', 'text', 15, 2, true,
    '<h2>Знайомство</h2><p><strong>Wie heißt du?</strong> — Як тебе звати?<br><strong>Ich heiße Maria.</strong> — Мене звати Марія.<br><strong>Wie ist Ihr Name?</strong> — Як ваше ім''я? (формально)<br><strong>Mein Name ist...</strong> — Моє ім''я...<br><strong>Woher kommst du?</strong> — Звідки ти?<br><strong>Ich komme aus der Ukraine.</strong> — Я з України.</p>')
  returning id into v_lesson2_id;

  -- Questions for lesson 1
  insert into public.questions (lesson_id, question, type, options, correct_answer, explanation, order_index)
  values
    (v_lesson1_id, 'Як перекладається "Guten Morgen"?', 'multiple_choice',
     '["Добрий день", "Доброго ранку", "Добрий вечір", "До побачення"]',
     'Доброго ранку', 'Morgen = ранок, guten = доброго', 1),
    (v_lesson1_id, 'Як сказати "Бувай" по-німецьки?', 'multiple_choice',
     '["Hallo", "Danke", "Tschüss", "Bitte"]',
     'Tschüss', 'Tschüss — неформальне прощання', 2),
    (v_lesson1_id, 'Яке привітання використовують вдень?', 'multiple_choice',
     '["Guten Morgen", "Guten Abend", "Guten Tag", "Auf Wiedersehen"]',
     'Guten Tag', 'Tag = день', 3);

  insert into public.questions (lesson_id, question, type, options, correct_answer, explanation, order_index)
  values
    (v_lesson2_id, 'Як запитати ім''я по-неформальному?', 'multiple_choice',
     '["Wie ist Ihr Name?", "Wie heißt du?", "Woher kommst du?", "Wie geht es dir?"]',
     'Wie heißt du?', 'heißt du = неформальна форма', 1),
    (v_lesson2_id, 'Як сказати "Я з України"?', 'multiple_choice',
     '["Ich heiße Ukraine", "Ich komme aus der Ukraine", "Ich bin Ukraine", "Ich wohne Ukraine"]',
     'Ich komme aus der Ukraine', 'kommen aus = бути звідки', 2);

  -- Module 2
  insert into public.modules (level_id, title, description, order_index)
  values (v_level_id, 'Числа та дати', 'Рахуємо від 1 до 100, дні та місяці', 2)
  returning id into v_module2_id;

  insert into public.lessons (module_id, title, description, content_type, duration_minutes, order_index, is_preview, content)
  values (v_module2_id, 'Zahlen 1-20 — Числа від 1 до 20', 'Вчимо числа', 'text', 15, 1, false,
    '<h2>Числа 1–20</h2><p>1 — ein/eins<br>2 — zwei<br>3 — drei<br>4 — vier<br>5 — fünf<br>6 — sechs<br>7 — sieben<br>8 — acht<br>9 — neun<br>10 — zehn<br>11 — elf<br>12 — zwölf<br>13 — dreizehn<br>20 — zwanzig</p>')
  returning id into v_lesson3_id;

  insert into public.lessons (module_id, title, description, content_type, duration_minutes, order_index, is_preview, content)
  values (v_module2_id, 'Wochentage — Дні тижня', 'Дні тижня по-німецьки', 'text', 10, 2, false,
    '<h2>Дні тижня</h2><p><strong>Montag</strong> — Понеділок<br><strong>Dienstag</strong> — Вівторок<br><strong>Mittwoch</strong> — Середа<br><strong>Donnerstag</strong> — Четвер<br><strong>Freitag</strong> — П''ятниця<br><strong>Samstag</strong> — Субота<br><strong>Sonntag</strong> — Неділя</p>')
  returning id into v_lesson4_id;

  insert into public.questions (lesson_id, question, type, options, correct_answer, explanation, order_index)
  values
    (v_lesson3_id, 'Як "п''ять" по-німецьки?', 'multiple_choice',
     '["vier", "sechs", "fünf", "sieben"]', 'fünf', 'fünf = 5', 1),
    (v_lesson4_id, 'Як "П''ятниця" по-німецьки?', 'multiple_choice',
     '["Montag", "Mittwoch", "Freitag", "Sonntag"]', 'Freitag', 'Freitag = П''ятниця', 1);

end $$;
