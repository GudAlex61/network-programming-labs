# Программирование сетевых приложений

## Кафедра ИУ5 "Системы обработки информации и управления"
### 2 курс, МГТУ им. Н. Э. Баумана

Данный репозиторий создан в рамках учебного курса "Программирование сетевых приложений". Целью работ является закрепление теоретических знаний и получение практических навыков разработки программного обеспечения, функционирующего в компьютерных сетях.

# Домашнее задание. Коллекции, функции, классы и three.js

Цель работы: внедрить в приложение третьей лабораторной две задачи по варианту, использовать коллекции, функции, классы и добавить 3D-модель на страницу подробной информации через three.js.

## Вариант

Первая буква фамилии — `Г`, номер группы — `3`.

По варианту реализованы задачи:

```text
2.4 — diff
3.3 — flatten
```

Задачи адаптированы под тему работы: помощь инвалидам и технические средства реабилитации.

## Содержание

1. План работы
2. Выполнение работы
   * 2.1. Структура изменений
   * 2.2. Задача 2.4 — diff
   * 2.3. Задача 3.3 — flatten
   * 2.4. Обязательные элементы ДЗ
   * 2.5. Подключение three.js
   * 2.6. Загрузка GLB-модели
3. Порядок показа
4. Заключение

---

## План работы

1. Взять приложение третьей лабораторной как основу.
2. Добавить отдельный компонент для задач домашнего задания.
3. Реализовать задачу `2.4 diff`.
4. Реализовать задачу `3.3 flatten`.
5. Использовать строку, объект, класс, массив, `Set` и цикл `do...while`.
6. Добавить компонент для 3D-модели.
7. Подключить three.js, `GLTFLoader` и `OrbitControls`.
8. Вывести модель инвалидного кресла на странице «Подробнее».

---

## Выполнение работы

### 2.1. Структура изменений

В проект были добавлены файлы:

```text
components/homework-tasks/index.js
components/rehab-model/index.js
models/accessibility-wheelchair.glb
```

Файл `homework-tasks/index.js` отвечает за первую часть ДЗ, а `rehab-model/index.js` — за вывод 3D-модели.

### 2.2. Задача 2.4 — diff

Условие задачи: реализовать функцию, которая возвращает элементы первого массива, которых нет во втором массиве.

В рамках темы работы первый массив — это список запрошенных технических средств реабилитации, второй массив — список уже выданных средств.

```js
const requestedEquipment = [
    'кресло-коляска',
    'пандус',
    'ходунки',
    'тактильная трость',
    'поручни'
];

const issuedEquipment = [
    'кресло-коляска',
    'ходунки'
];
```

Реализация функции:

```js
function diff(firstEquipmentList, secondEquipmentList) {
    const issuedEquipmentSet = new Set(secondEquipmentList);
    return firstEquipmentList.filter((equipmentName) => {
        return !issuedEquipmentSet.has(equipmentName);
    });
}
```

Функция создаёт `Set` из второго массива и оставляет только те элементы первого массива, которых нет во втором.

Результат:

```text
пандус, тактильная трость, поручни
```

### 2.3. Задача 3.3 — flatten

Условие задачи: реализовать функцию, которая преобразует вложенный массив любой глубины в обычный плоский массив.

В рамках темы работы используется вложенный маршрут оказания услуги:

```js
const nestedServiceRoute = [
    'приём заявления',
    [
        'проверка ИПРА',
        [
            'подбор ТСР',
            ['согласование доставки', 'выдача средства']
        ]
    ],
    'контроль качества услуги'
];
```

Реализация функции:

```js
function flatten(nestedServiceRoute) {
    const flatServiceRoute = [];

    nestedServiceRoute.forEach((serviceRouteItem) => {
        if (Array.isArray(serviceRouteItem)) {
            flatServiceRoute.push(...flatten(serviceRouteItem));
        } else {
            flatServiceRoute.push(serviceRouteItem);
        }
    });

    return flatServiceRoute;
}
```

Если элемент является массивом, функция вызывает сама себя. Если элемент является строкой, он добавляется в итоговый массив.

### 2.4. Обязательные элементы ДЗ

В работе используются:

Строка:

```js
const requestJournalText = 'заявка создана | документы проверены | оборудование подобрано | заявка закрыта | архивная запись';
```

Объект:

```js
const requestInfo = {
    requestNumber: 'ТСР-Г3-024',
    district: 'район социального обслуживания',
    priority: 'срочная выдача'
};
```

Класс:

```js
class SocialHelpRequest {
    constructor(requestInfo, requestedEquipment, issuedEquipment) {
        this.requestNumber = requestInfo.requestNumber;
        this.district = requestInfo.district;
        this.priority = requestInfo.priority;
        this.requestedEquipment = requestedEquipment;
        this.issuedEquipment = issuedEquipment;
    }
}
```

Коллекции:

```js
const requestedEquipment = [];
const issuedEquipment = [];
const issuedEquipmentSet = new Set(issuedEquipment);
```

Цикл с постусловием:

```js
do {
    currentJournalMessage = journalMessages.shift();
    visibleJournalMessages.push(currentJournalMessage);
} while (journalMessages.length > 0 && currentJournalMessage !== 'заявка закрыта');
```

Цикл читает журнал до сообщения `заявка закрыта`, то есть условие зависит не от счётчика, а от содержимого сообщения.

### 2.5. Подключение three.js

На странице подробнее добавлен компонент `RehabModelComponent`. В нём используется динамический импорт:

```js
const THREE = await import('three');
const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
```

Динамический импорт нужен, чтобы three.js загружался только на странице подробнее.

### 2.6. Загрузка GLB-модели

Для загрузки модели используется `GLTFLoader`:

```js
const loader = new GLTFLoader();

loader.load(modelUrl, (gltf) => {
    const model = gltf.scene;
    scene.add(model);
});
```

В качестве модели используется инвалидное кресло в формате `.glb`. Модель соответствует теме работы.

---

## Порядок показа

1. Открыть главную страницу приложения.
2. Показать блок домашнего задания.
3. Объяснить задачу `diff` и результат сравнения массивов.
4. Объяснить задачу `flatten` и разворачивание вложенного маршрута.
5. Показать использование строки, объекта, класса, коллекций и `do...while`.
6. Открыть страницу «Подробнее».
7. Показать 3D-модель инвалидного кресла.
8. Объяснить использование three.js и `GLTFLoader`.

---

## Заключение

В результате выполнения домашнего задания в приложение третьей лабораторной были добавлены задачи `2.4` и `3.3`, адаптированные под индивидуальную тему. Также были использованы обязательные элементы JavaScript: строка, объект, класс, массив, `Set` и цикл `do...while`. На странице подробнее была подключена 3D-модель в формате `.glb` через three.js.
