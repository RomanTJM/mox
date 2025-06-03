# Booking Service (Next.js + Supabase)

Демо-сервис бронирования площадок с поддержкой ролей, оплатой, email-уведомлениями и современным UI.

---

## Зависимости

- next
- react
- @supabase/supabase-js
- @pdf-lib/fontkit, pdf-lib
- stripe, @stripe/stripe-js
- mailgun-js
- react-hot-toast
- zod

## Установка

```bash
npm install
# или
yarn install
```

## Пример .env.local

Создайте файл `.env.local` в корне проекта и добавьте:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
```

- `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `MAILGUN_API_KEY` — **только для серверных API-роутов!**
- Публичные ключи начинаются с `NEXT_PUBLIC_`.

## Команды

- `npm run dev` — запуск в режиме разработки
- `npm run build` — сборка проекта
- `npm start` — запуск production-сборки

## Деплой

1. **Vercel (рекомендуется):**
   - Подключите репозиторий к [vercel.com](https://vercel.com/).
   - В настройках проекта добавьте переменные окружения из `.env.local`.
   - Запустите деплой.

2. **Другие сервисы:**
   - Аналогично: добавьте переменные окружения, запустите build/start.

## Важно

- Не коммитьте `.env.local` и приватные ключи в git!
- Все секреты должны использоваться только на сервере.
- Проверьте RLS-политики в Supabase.

---

**Вопросы по запуску или деплою — пишите!**

## Функциональность

- Аутентификация пользователей (регистрация/вход)
- Создание и управление площадками (для администраторов)
- Просмотр списка площадок
- Просмотр детальной информации о площадке
- Скачивание PDF с информацией о площадке
- Бронирование площадок  через Stripe

## Структура проекта

```
├── src/
│   ├── app/                 # Страницы приложения (Next.js)
│   ├── components/          # React-компоненты
│   ├── lib/                 # Конфиги и вспомогательные библиотеки (supabase, stripe и др.)
│   ├── types/               # TypeScript-типы
│   └── utils/               # Вспомогательные функции (PDF, email и др.)
├── supabase/
│   └── migrations/          # SQL-миграции для Supabase
└── public/                  # Статические файлы (шрифты, изображения)
```



