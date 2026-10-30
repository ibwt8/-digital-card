# Digital Card

Проект написан на TypeScript и NestJS. Для работы с PostgreSQL используется Prisma.

## Запуск

Нужны Docker и Docker Compose v2. Команды выполняются из корня проекта.
Порты 3000 и 5433 должны быть свободны.

Скопируйте файл `.env.example` в `.env`. В нём уже есть настройки для локального запуска.

Запустите проект:

```sh
docker compose up --build -d
```

При первом запуске приложение само создаст таблицы и заполнит их данными.
Сначала запускается база, затем сервис `init` выполняет миграции и seed, после чего запускается приложение.

Откройте [Apollo Sandbox](http://localhost:3000/graphql) и выполните запрос из примера ниже.

Посмотреть состояние контейнеров и логи:

```sh
docker compose ps -a
docker compose logs init app
```

Статус `Exited (0)` у `init` означает, что подготовка базы прошла успешно.

Остановить проект:

```sh
docker compose down
```

Данные базы при этом сохранятся в Docker-томе.

## Пример запроса

```graphql
query {
  profile {
    name
    description
    links {
      label
      url
    }
    skills {
      name
    }
    experience {
      company
      position
      startedAt
      endedAt
      achievements
    }
    projects {
      name
      url
    }
  }
}
```

Можно оставить в запросе только нужные поля. Например, запросить имя и навыки.
Если профиль не найден, API вернёт `profile: null`. Если список пуст, вернётся `[]`.
Поле `endedAt: null` означает, что работа продолжается.

## Как устроен проект

Код профиля находится в `src/profile`:

- `models` описывают поля GraphQL API. Схема создаётся из классов и декораторов.
- `profile.resolver.ts` принимает GraphQL-запросы и вызывает сервис.
- `profile.service.ts` связывает резолвер с репозиторием. Сейчас в нём нет сложной бизнес-логики.
- `profile.repository.ts` выполняет запросы к базе через Prisma.

В `src/prisma` находится подключение к базе, в `prisma/schema.prisma` — описание таблиц и связей, а в `prisma/migrations` — миграции.

Навыки, ссылки, опыт и проекты загружаются только тогда, когда они запрошены в GraphQL. Порядок записей задаётся полями `sortOrder` и `id`.
Сейчас API возвращает один профиль. Если добавить список профилей, загрузку связанных данных нужно будет объединить в пакетные запросы, чтобы избежать N+1.

Данные визитки находятся в `prisma/seed.ts`. Seed обновляет записи по постоянным идентификаторам, поэтому повторный запуск не создаёт их копии. Все изменения выполняются в одной транзакции.

## Разработка

Для запуска приложения без Docker нужны Node.js 24 и npm. Базу можно оставить в Docker.
Файл `.env` должен быть создан из `.env.example`.

Если приложение уже работает в контейнере, освободите порт 3000:

```sh
docker compose stop app
```

Установите зависимости, подготовьте базу и запустите приложение:

```sh
npm ci
docker compose up -d --wait db
npx prisma generate --config ./prisma7.config.ts
npx prisma migrate deploy --config ./prisma7.config.ts
npx prisma db seed --config ./prisma7.config.ts
npm run start:dev
```

При локальном запуске адрес базы в `DATABASE_URL` — `localhost:5433`. Внутри Docker используется `db:5432`.

После изменения `prisma/schema.prisma` создайте миграцию и обновите Prisma Client:

```sh
npx prisma migrate dev --name describe_change --config ./prisma7.config.ts
npx prisma generate --config ./prisma7.config.ts
```

Команда `migrate dev` создаёт миграции при разработке. При запуске контейнеров `migrate deploy` применяет готовые миграции из репозитория.

## Проверка

После установки зависимостей и генерации Prisma Client выполните:

```sh
npm run build
npm run lint
npm test
npm run test:e2e
```

Для e2e-тестов нужна работающая база с применёнными миграциями и данными из seed. Адрес берётся из `DATABASE_URL`.
Тесты проверяют HTTP-маршрут и GraphQL-запрос профиля со связанными полями. Пока они используют базу разработки.
