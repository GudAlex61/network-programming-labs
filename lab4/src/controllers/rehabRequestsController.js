const rehabRequestsService = require('../services/rehabRequestsService');

const REQUIRED_REHAB_REQUEST_FIELDS = [
    'applicantName',
    'applicantCategory',
    'equipmentName',
    'district'
];

const getRehabRequestId = (request, response) => {
    const rehabRequestId = Number.parseInt(request.params.rehabRequestId, 10);

    if (Number.isNaN(rehabRequestId)) {
        response.status(400).json({
            error: 'ID заявки должен быть числом'
        });
        return null;
    }

    return rehabRequestId;
};

const checkRehabRequestExists = (request, response) => {
    const rehabRequestId = getRehabRequestId(request, response);
    if (rehabRequestId === null) return;

    const rehabRequest = rehabRequestsService.findOne(rehabRequestId);

    if (!rehabRequest) {
        return response.status(404).send();
    }

    response.status(200).send();
};

const getMissingFields = (rehabRequestData) => {
    return REQUIRED_REHAB_REQUEST_FIELDS.filter((fieldName) => {
        return !rehabRequestData[fieldName] || String(rehabRequestData[fieldName]).trim() === '';
    });
};

const getRehabRequestsList = (request, response) => {
    const rehabRequests = rehabRequestsService.findAll(request.query);
    response.status(200).json(rehabRequests);
};

const getRehabRequestById = (request, response) => {
    const rehabRequestId = getRehabRequestId(request, response);
    if (rehabRequestId === null) return;

    const rehabRequest = rehabRequestsService.findOne(rehabRequestId);

    if (!rehabRequest) {
        return response.status(404).json({
            error: 'Заявка на техническое средство реабилитации не найдена'
        });
    }

    response.status(200).json(rehabRequest);
};

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

const updateRehabRequest = (request, response) => {
    const rehabRequestId = getRehabRequestId(request, response);
    if (rehabRequestId === null) return;

    if (Object.keys(request.body).length === 0) {
        return response.status(400).json({
            error: 'Для редактирования нужно передать хотя бы одно поле'
        });
    }

    const updatedRehabRequest = rehabRequestsService.update(rehabRequestId, request.body);

    if (!updatedRehabRequest) {
        return response.status(404).json({
            error: 'Заявка на техническое средство реабилитации не найдена'
        });
    }

    response.status(200).json(updatedRehabRequest);
};

const deleteRehabRequest = (request, response) => {
    const rehabRequestId = getRehabRequestId(request, response);
    if (rehabRequestId === null) return;

    const isRemoved = rehabRequestsService.remove(rehabRequestId);

    if (!isRemoved) {
        return response.status(404).json({
            error: 'Заявка на техническое средство реабилитации не найдена'
        });
    }

    response.status(204).send();
};

module.exports = {
    getRehabRequestsList,
    getRehabRequestById,
    createRehabRequest,
    updateRehabRequest,
    deleteRehabRequest,
    checkRehabRequestExists
};
