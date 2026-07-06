# IS.BEAUTY.KH — GitHub + Render Ready

Полноценный full-stack проект сайта салона красоты с:

- публичным frontend `client/site.html`
- закрытой админкой `client/admin.html`
- backend API на Node.js/Express
- JWT-авторизацией
- загрузкой файлов
- контентом в `server/data/content.json`
- готовой конфигурацией для деплоя на Render

## Структура проекта

```bash
isbeauty-fullstack/
├── client/
│   ├── site.html
│   └── admin.html
├── server/
│   ├── data/content.json
│   ├── uploads/
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── render.yaml
└── README.md
```

## Локальный запуск

```bash
npm install
npm start
```

После запуска:

- сайт: `http://localhost:10000/`
- админка: `http://localhost:10000/admin`
- healthcheck: `http://localhost:10000/api/health`

## Переменные окружения

Создай `.env` в корне проекта на основе `.env.example`:

```env
PORT=10000
NODE_ENV=production
ADMIN_LOGIN=admin
ADMIN_PASSWORD=change_me_strong_password
JWT_SECRET=change_me_super_secret_jwt_key
```

## GitHub

1. Создай новый репозиторий на GitHub.
2. Загрузи в него все файлы проекта.
3. Убедись, что `.env` не загружается в репозиторий, он уже добавлен в `.gitignore`.

Пример команд:

```bash
git init
git add .
git commit -m "Initial Render-ready IS.BEAUTY.KH project"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Render

### Вариант 1: через render.yaml

1. Зайди в Render.
2. Создай `New +` → `Blueprint`.
3. Подключи GitHub-репозиторий.
4. Render автоматически считает `render.yaml` и создаст web service.

### Вариант 2: вручную

- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

## Environment Variables в Render

Добавь в Render:

- `NODE_ENV=production`
- `PORT=10000` или оставь системный порт Render
- `ADMIN_LOGIN=admin`
- `ADMIN_PASSWORD=свой_пароль`
- `JWT_SECRET=длинный_случайный_секрет`

## Важные замечания по Render

- `server/uploads/` на Render не является постоянным хранилищем между пересборками и рестартами сервиса.
- Для production лучше позже вынести загрузку изображений в Cloudinary, S3 или Supabase Storage.
- Контент сейчас хранится в `server/data/content.json`, что подходит для MVP и демонстрации, но для серьёзного production лучше перейти на базу данных.

## Онлайн-запись

Все кнопки записи ведут в существующую систему:

- `https://bumpix.net/291332`

## Что можно улучшить дальше

- подключить PostgreSQL
- сделать persistent media storage
- добавить роли `admin/editor`
- добавить refresh tokens
- перевести контент на настоящую CMS-структуру
