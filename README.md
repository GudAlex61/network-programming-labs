# Программирование сетевых приложений

## Кафедра ИУ5 "Системы обработки информации и управления"
### 2 курс, МГТУ им. Н. Э. Баумана

Данный репозиторий создан в рамках учебного курса "Программирование сетевых приложений". Целью работ является закрепление теоретических знаний и получение практических навыков разработки программного обеспечения, функционирующего в компьютерных сетях.

# ЛР 4. Node.js API с хранением данных в JSON-файле

Цель работы: реализовать на Node.js собственный backend API-сервис, в котором данные хранятся в JSON-файле. API должен поддерживать список с фильтрацией, получение одной записи, добавление, редактирование и удаление.

## Содержание

1. План работы
2. Выполнение работы
   * 2.1. Структура проекта
   * 2.2. Запуск сервера
   * 2.3. JSON-файл с данными
   * 2.4. Router
   * 2.5. Controller
   * 2.6. Service
   * 2.7. Методы API
   * 2.8. CORS и HEAD-запрос
3. Тестирование через Postman
4. Контрольные вопросы
5. Заключение

---

## План работы

1. Создать Node.js-проект.
2. Установить Express.
3. Создать JSON-файл для хранения заявок.
4. Реализовать структуру `routes`, `controllers`, `services`, `data`.
5. Реализовать 5 основных методов API.
6. Добавить фильтрацию списка.
7. Добавить обработку кодов состояния.
8. Проверить методы через Postman.

---

## Выполнение работы

### 2.1. Структура проекта

```text
lab4/
  package.json
  src/
    index.js
    routes/
      rehabRequests.js
    controllers/
      rehabRequestsController.js
    services/
      jsonFileStorage.js
      rehabRequestsService.js
    data/
      rehabRequests.json
  postman/
    lab4-rehab-requests.postman_collection.json
```

Тема API — заявки на технические средства реабилитации.

### 2.2. Запуск сервера

Для установки зависимостей:

```bash
npm install
```

Для запуска сервера:

```bash
npm start
```

Сервер работает по адресу:

```text
http://localhost:3000
```

### 2.3. JSON-файл с данными

Данные хранятся в файле:

```text
src/data/rehabRequests.json
```

Пример записи:

```json
{
  "id": 1,
  "applicantName": "Мария Смирнова",
  "applicantCategory": "инвалид I группы",
  "equipmentName": "кресло-коляска активного типа",
  "district": "Тверской",
  "status": "в работе",
  "priority": "срочная",
  "requestDate": "2026-04-05",
  "comment": "Нужна доставка на дом и настройка под рост заявителя"
}
```

### 2.4. Router

Файл:

```text
src/routes/rehabRequests.js
```

Router связывает HTTP-метод и URL с функцией контроллера:

```js
router.get('/', rehabRequestsController.getRehabRequestsList);
router.head('/:rehabRequestId', rehabRequestsController.checkRehabRequestExists);
router.get('/:rehabRequestId', rehabRequestsController.getRehabRequestById);
router.post('/', rehabRequestsController.createRehabRequest);
router.patch('/:rehabRequestId', rehabRequestsController.updateRehabRequest);
router.delete('/:rehabRequestId', rehabRequestsController.deleteRehabRequest);
```

### 2.5. Controller

Файл:

```text
src/controllers/rehabRequestsController.js
```

Controller принимает запрос, проверяет данные, вызывает service и отправляет HTTP-ответ.

Пример обработки добавления:

```js
const createRehabRequest = (request, response) => {
    const missingFields = getMissingFields(request.body);

    if (missingFields.length > 0) {
        return response.status(400).json({
            error: 'Не заполнены обязательные поля заявки',
            missingFields
        });
    }

    const createdRehabRequest = rehabRequestsService.create(request.body);
    response.status(201).json(createdRehabRequest);
};
```

### 2.6. Service

Файл:

```text
src/services/rehabRequestsService.js
```

Service содержит бизнес-логику работы с заявками:

```text
findAll
findOne
create
update
remove
```

Код добавления новой записи:

```js
const create = (rehabRequestData) => {
    const rehabRequests = jsonFileStorage.readJsonData(rehabRequestsDataPath);

    const createdRehabRequest = {
        id: getNextRehabRequestId(rehabRequests),
        applicantName: rehabRequestData.applicantName,
        applicantCategory: rehabRequestData.applicantCategory,
        equipmentName: rehabRequestData.equipmentName,
        district: rehabRequestData.district,
        status: rehabRequestData.status || 'новая',
        priority: rehabRequestData.priority || 'обычная',
        requestDate: rehabRequestData.requestDate || new Date().toISOString().slice(0, 10),
        comment: rehabRequestData.comment || ''
    };

    rehabRequests.push(createdRehabRequest);
    jsonFileStorage.writeJsonData(rehabRequestsDataPath, rehabRequests);

    return createdRehabRequest;
};
```

### 2.7. Методы API

Базовый URL:

```text
http://localhost:3000/api/rehab-requests
```

#### Список с фильтрацией

```http
GET /api/rehab-requests
GET /api/rehab-requests?status=в работе&district=Тверской
```

Код ответа: `200 OK`.

#### Получение одной записи

```http
GET /api/rehab-requests/:rehabRequestId
```

Коды ответа:

```text
200 OK — запись найдена
400 Bad Request — некорректный id
404 Not Found — запись не найдена
```

#### Добавление записи

```http
POST /api/rehab-requests
```

Пример JSON:

```json
{
  "applicantName": "Егор Гаврилов",
  "applicantCategory": "инвалид III группы",
  "equipmentName": "опорная трость",
  "district": "Тверской",
  "status": "новая",
  "priority": "обычная",
  "comment": "Нужна выдача в центре социальной поддержки"
}
```

Коды ответа:

```text
201 Created — запись создана
400 Bad Request — не заполнены обязательные поля
```

#### Редактирование записи

```http
PATCH /api/rehab-requests/:rehabRequestId
```

Пример JSON:

```json
{
  "status": "выдано",
  "comment": "Средство реабилитации выдано заявителю"
}
```

Коды ответа:

```text
200 OK — запись изменена
400 Bad Request — некорректный id или пустое тело запроса
404 Not Found — запись не найдена
```

#### Удаление записи

```http
DELETE /api/rehab-requests/:rehabRequestId
```

Коды ответа:

```text
204 No Content — запись удалена
400 Bad Request — некорректный id
404 Not Found — запись не найдена
```

### 2.8. CORS и HEAD-запрос

Для работы frontend-приложения пятой лабораторной был добавлен CORS middleware:

```js
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, DELETE, OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.sendStatus(204);
    }

    next();
});
```

Также добавлен `HEAD`-метод:

```http
HEAD /api/rehab-requests/:rehabRequestId
```

Он проверяет существование заявки без возврата тела ответа.

---

## Тестирование через Postman

Для проверки используется коллекция Postman:

```text
postman/lab4-rehab-requests.postman_collection.json
```

Порядок показа:

1. Показать список всех заявок.
2. Добавить новую заявку через `POST`.
3. Получить добавленную заявку по `id`.
4. Отредактировать заявку через `PATCH`.
5. Удалить заявку через `DELETE`.
6. Показать список с фильтрацией.
7. Показать `HEAD`-запрос.

---

## Контрольные вопросы

### Что такое Node.js

Node.js — это среда выполнения JavaScript вне браузера. Она позволяет писать серверные приложения на JavaScript.

### Особенности Node.js

Node.js работает на движке V8, использует событийную модель и неблокирующий ввод-вывод. Он хорошо подходит для API, web-серверов и сетевых приложений.

### Клиент-серверная модель

Клиент отправляет HTTP-запрос, сервер обрабатывает его и возвращает HTTP-ответ. В данной лабораторной клиентом является Postman, сервером — Express-приложение, а хранилищем данных — JSON-файл.

### SSR и SPA

SSR — HTML формируется на сервере. SPA — одна HTML-страница загружается в браузер, а данные затем подгружаются через API. Данная лабораторная реализует API-сервер, который может использоваться SPA-приложением.

### Встроенные библиотеки Node.js

* `fs` — работа с файловой системой;
* `path` — работа с путями;
* `http` — создание HTTP-сервера;
* `url` — работа с URL;
* `events` — работа с событиями.

---

## Заключение

В результате выполнения лабораторной работы был создан REST API на Node.js и Express. Данные хранятся в JSON-файле. Реализованы методы получения списка, фильтрации, получения записи по id, добавления, редактирования, удаления и проверки существования через HEAD.
