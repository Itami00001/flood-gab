# J Hub - Автосалон

Курсовой проект по дисциплине «Базы данных». Веб-приложение для учёта продаж, аренды и тест-драйвов автомобилей в салоне J Hub.

## Описание проекта

J Hub — это система управления автосалоном, которая позволяет:
- Управлять каталогом автомобилей
- Оформлять продажи и аренду автомобилей
- Записывать клиентов на тест-драйвы
- Отслеживать статистику и отчёты
- Управлять пользователями и ролями (admin, manager, client)

## Технологический стек

- **Backend:** Node.js 18 + Express 4
- **База данных:** PostgreSQL 15
- **ORM:** Sequelize 6
- **Контейнеризация:** Docker Compose
- **API документация:** Swagger (OpenAPI 3.0)
- **Frontend:** HTML + CSS + JavaScript

## Установка и запуск

### Требования

- Docker
- Docker Compose
- Git

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Itami00001/flood-gab.git
cd flood-gab
```

2. Запустите проект с помощью Docker Compose:
```bash
docker-compose up -d --build
```

3. Для инициализации тестовых данных выполните:
```bash
docker-compose exec app npm run seed
```

### Доступ к приложению

- **Веб-интерфейс:** http://localhost:6868/
- **Swagger API:** http://localhost:6868/api-docs
- **База данных:** localhost:5433

### Тестовые пользователи

- **Admin:** username: `admin`, password: `adminadmin`
- **Client:** username: `test`, password: `testtest`

## API документация

API документация доступна по адресу http://localhost:6868/api-docs

### Основные эндпоинты

- `POST /api/users/register` - Регистрация пользователя
- `POST /api/users/login` - Вход в систему
- `GET /api/cars` - Получить список автомобилей
- `POST /api/sales` - Создать продажу
- `POST /api/rentals` - Создать аренду
- `POST /api/testdrives` - Создать тест-драйв
- `GET /api/admin/statistics/overview` - Получить статистику

## Структура проекта

```
j-hub/
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
│   │   │   └── testdrive.model.js
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
│   │       └── auth.middleware.js
│   ├── public/
│   │   ├── index.html
│   │   ├── car.html
│   │   ├── rentals.html
│   │   ├── profile.html
│   │   ├── admin.html
│   │   ├── login.html
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
├── .env
├── docker-compose.yml
└── README.md
```

## Модель данных

Проект включает 7 сущностей:

1. **User** - учётные записи пользователей
2. **Customer** - профиль клиента
3. **Employee** - профиль сотрудника
4. **Car** - автомобиль
5. **Sale** - продажа
6. **Rental** - аренда
7. **TestDrive** - тест-драйв (связующая таблица M:N)

### Связи между сущностями

- User 1:1 Customer
- User 1:1 Employee
- Customer 1:N Sale
- Customer 1:N Rental
- Customer M:N Car (через TestDrive)
- Employee 1:N Sale
- Employee 1:N Rental
- Employee 1:N TestDrive
- Car 1:N Sale
- Car 1:N Rental

## Роли пользователей

- **admin** - полный доступ ко всем функциям
- **manager** - управление авто, продажами, арендой, тест-драйвами
- **client** - просмотр каталога, оформление заказов, просмотр своих записей

## Разработка

### Локальная разработка

Для локальной разработки без Docker:

1. Установите зависимости:
```bash
cd j-hub-app
npm install
```

2. Настройте переменные окружения в `.env`

3. Запустите сервер:
```bash
npm start
```

4. Для инициализации данных:
```bash
npm run seed
```

## Лицензия

Этот проект создан в учебных целях.

## Контактная информация

- Автор: курсовой проект по БД
- Год: 2024

## Благодарности

Проект разработан с использованием материалов лабораторных работ ЛР-8...ЛР-14.
