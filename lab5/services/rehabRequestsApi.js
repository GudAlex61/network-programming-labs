const API_BASE_URL = 'http://localhost:3000/api/rehab-requests';

const buildQueryString = (filters = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([filterName, filterValue]) => {
        if (filterValue) {
            searchParams.append(filterName, filterValue);
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
};

const parseJsonResponse = (xhr) => {
    if (xhr.status === 204 || !xhr.responseText) {
        return null;
    }

    try {
        return JSON.parse(xhr.responseText);
    } catch (error) {
        return xhr.responseText;
    }
};

const sendRehabRequest = ({ method, url, body = null }) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onload = () => {
            const responseData = parseJsonResponse(xhr);

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(responseData);
                return;
            }

            reject({
                status: xhr.status,
                data: responseData,
                message: responseData?.error || `Ошибка запроса: ${xhr.status}`
            });
        };

        xhr.onerror = () => {
            reject({
                status: 0,
                message: 'XHR-запрос не выполнен. Проверьте, что сервер 4 ЛР запущен, и включите CORS Unblock в браузере.'
            });
        };

        xhr.send(body ? JSON.stringify(body) : null);
    });
};

export const rehabRequestsApi = {
    getList(filters = {}) {
        return sendRehabRequest({
            method: 'GET',
            url: `${API_BASE_URL}${buildQueryString(filters)}`
        });
    },

    getOne(rehabRequestId) {
        return sendRehabRequest({
            method: 'GET',
            url: `${API_BASE_URL}/${rehabRequestId}`
        });
    },

    create(rehabRequestData) {
        return sendRehabRequest({
            method: 'POST',
            url: API_BASE_URL,
            body: rehabRequestData
        });
    },

    update(rehabRequestId, rehabRequestData) {
        return sendRehabRequest({
            method: 'PATCH',
            url: `${API_BASE_URL}/${rehabRequestId}`,
            body: rehabRequestData
        });
    },

    remove(rehabRequestId) {
        return sendRehabRequest({
            method: 'DELETE',
            url: `${API_BASE_URL}/${rehabRequestId}`
        });
    }
};
