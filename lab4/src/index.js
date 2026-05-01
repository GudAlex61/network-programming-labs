const express = require('express');
const path = require('path');

const rehabRequestsRouter = require('./routes/rehabRequests');
const rehabRequestsService = require('./services/rehabRequestsService');

const app = express();
const PORT = process.env.PORT || 3000;
const REHAB_REQUESTS_DATA_PATH = path.join(__dirname, 'data', 'rehabRequests.json');

rehabRequestsService.init(REHAB_REQUESTS_DATA_PATH);

app.use(express.json());

app.use((request, response, next) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.originalUrl}`);
    next();
});

app.get('/', (request, response) => {
    response.json({
        message: 'API заявок на технические средства реабилитации работает',
        endpoints: [
            'GET /api/rehab-requests',
            'GET /api/rehab-requests?status=в работе&district=Тверской',
            'GET /api/rehab-requests/:rehabRequestId',
            'POST /api/rehab-requests',
            'PATCH /api/rehab-requests/:rehabRequestId',
            'DELETE /api/rehab-requests/:rehabRequestId',
        ]
    });
});

app.use('/api/rehab-requests', rehabRequestsRouter);

app.use((request, response) => {
    response.status(404).json({
        error: 'Маршрут не найден'
    });
});

app.use((error, request, response, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return response.status(400).json({
            error: 'Некорректный JSON в теле запроса'
        });
    }

    console.error(error);
    response.status(500).json({
        error: 'Внутренняя ошибка сервера'
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
