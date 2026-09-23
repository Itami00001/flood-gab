# J Hub — Автосалон

Курсовой проект по дисциплине «Базы данных». Веб-приложение для учёта продаж, аренды и тест-драйвов автомобилей в салоне J Hub.

Стек: Node.js 18 + Express 4 + Sequelize 6 + PostgreSQL 15 + Docker Compose + Swagger (OpenAPI 3.0).

## Быстрый старт на другом устройстве (Docker)

### Требования

- Git
- Docker Desktop 4+ (с Docker Compose v2)
- Свободные порты: `6868` (сайт/API) и `5433` (PostgreSQL)

### 1. Клонировать репозиторий

```bash
git clone https://github.com/Itami00001/flood-gab.git
cd flood-gab
```

### 2. Создать `.env` в корне проекта

Файл `.env` не хранится в git (см. `.gitignore`), поэтому создайте его вручную:

```
POSTGRESDB_USER=postgres
POSTGRESDB_ROOT_PASSWORD=123456
POSTGRESDB_DATABASE=j-hub-db
POSTGRESDB_LOCAL_PORT=5433
POSTGRESDB_DOCKER_PORT=5432

NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=8080
```

> Если порты заняты — поменяйте только `*_LOCAL_PORT` (левые числа).

### 3. Поднять контейнеры

```bash
docker compose up -d --build
```

### 4. Заполнить БД тестовыми данными

```bash
docker exec j-hub-app npm run seed
```

> Внимание: seed пересоздаёт таблицы (`sync({ force: true })`) — все введённые вручную данные будут стёрты.

### 5. Проверка

- Сайт: http://localhost:6868/
- Swagger: http://localhost:6868/api-docs
- Вход как admin: `admin` / `adminadmin` (на странице `login.html` есть кнопки быстрого входа)
- Админ-панель: http://localhost:6868/admin.html → вкладка «Авто» показывает все 10 автомобилей со статусами

## Доступы

| Что | Адрес / значение |
|---|---|
| Сайт | http://localhost:6868/ |
| Swagger UI | http://localhost:6868/api-docs |
| PostgreSQL (для pgAdmin) | host `localhost`, порт `5433`, БД `j-hub-db`, пользователь `postgres`, пароль `123456` |

### Тестовые пользователи

| Username | Password | Роль | Профиль | Баланс |
|---|---|---|---|---|
| `admin` | `adminadmin` | admin | Employee (менеджер) | — (нет customer-профиля, баланс 0) |
| `test` | `testtest` | client | Customer | 7 000 000 COIN |

Быстрый вход: страница `login.html`, кнопки «Admin» и «Test User».

### Что создаёт seed

- 2 пользователя (`admin`, `test`), 1 сотрудник, 1 клиент
- 10 автомобилей (Toyota, Nissan, Honda, Mazda, Mitsubishi, Subaru, Lexus, Infiniti, Acura)
- 3 продажи (2 `completed`, 1 `pending`; авто завершённых продаж → `sold`)
- 3 аренды (2 `completed`, 1 `active`; авто активной аренды → `rented`)
- 4 тест-драйва (2 `done`, 2 `scheduled`)

## API

Полное описание — в Swagger: http://localhost:6868/api-docs (теги Users, Customers, Employees, Cars, Sales, Rentals, TestDrives, Admin).

Ключевые эндпоинты (проверены вживую):

- `POST /api/users/register` — регистрация (создаёт User + Customer с балансом 7 000 000)
- `POST /api/users/login` — вход (возвращает `role`, `customer_id`, `balance`)
- `GET /api/users/top/spenders?limit=` — топ клиентов по сумме покупок (raw SQL)
- `GET /api/cars` — все авто (+ фильтры `?brand=&status=&min_price=&max_price=`)
- `GET /api/cars/:id/details` — карточка авто с последней продажей (raw SQL)
- `PUT /api/sales/:id/complete` — завершить продажу (авто → `sold`)
- `GET /api/sales/statistics/sales` — выручка по месяцам (raw SQL)
- `PUT /api/rentals/:id/return` — завершить аренду (авто → `available`)
- `GET /api/rentals/available?start=&end=` — свободные авто на период (raw SQL, `OVERLAPS`)
- `GET /api/testdrives/schedule?date=` — расписание тест-драйвов на дату (raw SQL)
- `GET /api/admin/statistics/overview` — сводка (пользователи, авто, продажи, аренды, выручка)
- `GET /api/admin/cars/stats` — авто + счётчики продаж/аренд/тест-драйвов
- `GET /api/admin/testdrives/popular` — топ-5 авто по тест-драйвам (raw SQL)
- `GET /api/admin/employees/performance` — эффективность сотрудников (raw SQL)
- `GET /api/admin/logs?level=` — системные логи (info/warn/error)
- `PUT /api/admin/users/:id/topup` — пополнение баланса клиента

## Структура проекта

```
flood-gab/
├── j-hub-app/
│   ├── app/
│   │   ├── config/
│   │   │   ├── db.config.js
│   │   │   └── seed.js
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   ├── customer.controller.js
│   │   │   ├── employee.controller.js
│   │   │   ├── car.controller.js
│   │   │   ├── sale.controller.js
│   │   │   ├── rental.controller.js
│   │   │   ├── testdrive.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── references.model.js
│   │   │   ├── user.model.js
│   │   │   ├── customer.model.js
│   │   │   ├── employee.model.js
│   │   │   ├── car.model.js
│   │   │   ├── sale.model.js
│   │   │   ├── rental.model.js
│   │   │   ├── testdrive.model.js
│   │   │   └── log.model.js
│   │   ├── routes/
│   │   │   ├── user.routes.js
│   │   │   ├── customer.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── car.routes.js
│   │   │   ├── sale.routes.js
│   │   │   ├── rental.routes.js
│   │   │   ├── testdrive.routes.js
│   │   │   └── admin.routes.js
│   │   └── middleware/
│   │       ├── auth.middleware.js
│   │       └── logger.middleware.js
│   ├── public/
│   │   ├── index.html
│   │   ├── car.html
│   │   ├── rentals.html
│   │   ├── profile.html
│   │   ├── admin.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── api.js
│   │       ├── catalog.js
│   │       ├── admin.js
│   │       └── auth.js
│   ├── .env.sample
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── .env                # не в git, создать по п. 2
├── docker-compose.yml
└── README.md
```

## Модель данных

Ровно 7 сущностей (+ служебная таблица `logs` вне подсчёта):

1. **User** — учётные записи (`username` UQ, `email` UQ, `password_hash` bcrypt, `full_name`, `role`: admin/manager/client)
2. **Customer** — профиль клиента (`user_id` UQ FK, `phone`, `address`, `passport_data`, `balance` DEFAULT 7 000 000)
3. **Employee** — профиль сотрудника (`user_id` UQ FK, `position`, `phone`, `hire_date`)
4. **Car** — автомобиль (`articul` UQ, `brand`, `model`, `year`, `color`, `mileage`, `price`, `status`: available/sold/rented/service, `equipment`, `photo_url`, `vin` UQ)
5. **Sale** — продажа (`car_id`, `customer_id`, `employee_id`, `sale_date`, `total_price`, `payment_method`, `status`: pending/completed/cancelled)
6. **Rental** — аренда (`car_id`, `customer_id`, `employee_id`, `start_date`, `end_date`, `total_price`, `status`: active/completed/cancelled)
7. **TestDrive** — тест-драйв, связующая M:N (`customer_id` + `car_id` + `date` — составной PK, `employee_id`, `status`: scheduled/done/cancelled)

Связи (`app/models/references.model.js`, поля в `snake_case` через `underscored: true`):

- User 1:1 Customer, User 1:1 Employee (CASCADE при удалении)
- Customer 1:N Sale, Customer 1:N Rental, Customer 1:N TestDrive
- Employee 1:N Sale, Employee 1:N Rental, Employee 1:N TestDrive
- Car 1:N Sale, Car 1:N Rental, Car 1:N TestDrive
- Customer M:N Car через TestDrive

## Роли

- **admin** — всё: пользователи, авто, продажи, аренда, тест-драйвы, статистика, логи
- **manager** — авто, продажи, аренда, тест-драйвы, клиенты (без управления пользователями)
- **client** — каталог, оформление тест-драйва/аренды/покупки, свой профиль

## Админ-панель

`admin.html`, 7 вкладок с кнопкой «Обновить» у каждой таблицы: Пользователи (баланс + пополнение), Авто (все авто со статусом), Продажи, Аренда, Тест-драйвы, Статистика (карточки: пользователи, авто, продажи, аренды, тест-драйвы, выручка), Логи (фильтр info/warn/error).

## Полезные команды

```bash
docker compose ps                 # статус контейнеров
docker logs j-hub-app --tail 50   # логи приложения
docker compose restart            # перезапуск без пересборки
docker compose up -d --build      # пересборка после изменения кода/статикі
docker exec j-hub-app npm run seed # пересев БД (стирает данные!)
```

## Troubleshooting

- **Порты заняты** — смените `NODE_LOCAL_PORT` / `POSTGRESDB_LOCAL_PORT` в `.env` и повторите `up -d`.
- **Старый интерфейс после правок JS/HTML** — нужен `docker compose up -d --build` (образ копирует код при сборке, `restart` недостаточно).
- **Пути с OneDrive/пробелами (Windows)** — команды выполнять из корня `flood-gab`, пути в кавычках.
- **`/api/rentals/available` возвращал 500** — исправлено порядком роутов (`/available` до `/:id`).

## Локальная разработка без Docker

```bash
cd j-hub-app
npm install
npm start        # нужен доступный PostgreSQL и переменные окружения
npm run seed     # тестовые данные
```

## Лицензия

Учебный проект.

## Контакты

- Автор: курсовой проект по БД
- Год: 2026

## Благодарности

Материалы лабораторных работ ЛР-8…ЛР-14.
