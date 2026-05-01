const jsonFileStorage = require('./jsonFileStorage');

let rehabRequestsDataPath;

const init = (filePath) => {
    rehabRequestsDataPath = filePath;
};

const normalizeText = (value) => {
    return String(value || '').trim().toLowerCase();
};

const getNextRehabRequestId = (rehabRequests) => {
    if (rehabRequests.length === 0) {
        return 1;
    }

    return Math.max(...rehabRequests.map((rehabRequest) => rehabRequest.id)) + 1;
};

const findAll = (filters = {}) => {
    let rehabRequests = jsonFileStorage.readJsonData(rehabRequestsDataPath);

    const {
        equipmentName,
        applicantCategory,
        status,
        district,
        priority
    } = filters;

    if (equipmentName) {
        const equipmentNameFilter = normalizeText(equipmentName);
        rehabRequests = rehabRequests.filter((rehabRequest) => {
            return normalizeText(rehabRequest.equipmentName).includes(equipmentNameFilter);
        });
    }

    if (applicantCategory) {
        const applicantCategoryFilter = normalizeText(applicantCategory);
        rehabRequests = rehabRequests.filter((rehabRequest) => {
            return normalizeText(rehabRequest.applicantCategory).includes(applicantCategoryFilter);
        });
    }

    if (status) {
        const statusFilter = normalizeText(status);
        rehabRequests = rehabRequests.filter((rehabRequest) => {
            return normalizeText(rehabRequest.status) === statusFilter;
        });
    }

    if (district) {
        const districtFilter = normalizeText(district);
        rehabRequests = rehabRequests.filter((rehabRequest) => {
            return normalizeText(rehabRequest.district).includes(districtFilter);
        });
    }

    if (priority) {
        const priorityFilter = normalizeText(priority);
        rehabRequests = rehabRequests.filter((rehabRequest) => {
            return normalizeText(rehabRequest.priority) === priorityFilter;
        });
    }

    return rehabRequests;
};

const findOne = (rehabRequestId) => {
    const rehabRequests = jsonFileStorage.readJsonData(rehabRequestsDataPath);
    return rehabRequests.find((rehabRequest) => rehabRequest.id === rehabRequestId);
};

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

const update = (rehabRequestId, rehabRequestData) => {
    const rehabRequests = jsonFileStorage.readJsonData(rehabRequestsDataPath);
    const rehabRequestIndex = rehabRequests.findIndex((rehabRequest) => rehabRequest.id === rehabRequestId);

    if (rehabRequestIndex === -1) {
        return null;
    }

    rehabRequests[rehabRequestIndex] = {
        ...rehabRequests[rehabRequestIndex],
        ...rehabRequestData,
        id: rehabRequestId
    };

    jsonFileStorage.writeJsonData(rehabRequestsDataPath, rehabRequests);

    return rehabRequests[rehabRequestIndex];
};

const remove = (rehabRequestId) => {
    const rehabRequests = jsonFileStorage.readJsonData(rehabRequestsDataPath);
    const filteredRehabRequests = rehabRequests.filter((rehabRequest) => rehabRequest.id !== rehabRequestId);

    if (filteredRehabRequests.length === rehabRequests.length) {
        return false;
    }

    jsonFileStorage.writeJsonData(rehabRequestsDataPath, filteredRehabRequests);
    return true;
};

module.exports = {
    init,
    findAll,
    findOne,
    create,
    update,
    remove,
    
};
