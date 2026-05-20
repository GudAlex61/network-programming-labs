import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { rehabRequestsApi } from "../../services/rehabRequestsApi.js";

export class RehabRequestFormPage {
    constructor(parent, rehabRequest = null) {
        this.parent = parent;
        this.rehabRequest = rehabRequest;
        this.isEditMode = Boolean(rehabRequest);
    }

    getValue(fieldName, defaultValue = '') {
        return this.rehabRequest?.[fieldName] || defaultValue;
    }

    getHTML() {
        return `
            <div id="rehab-form-page" class="container">
                <div class="back-button-placeholder mb-3"></div>
                <h1>${this.isEditMode ? 'Редактирование заявки' : 'Добавление заявки'}</h1>

                <form class="rehab-request-form" id="rehab-request-form">
                    <label>
                        ФИО заявителя
                        <input class="form-control" name="applicantName" value="${this.getValue('applicantName')}" required>
                    </label>

                    <label>
                        Категория заявителя
                        <input class="form-control" name="applicantCategory" value="${this.getValue('applicantCategory')}" required>
                    </label>

                    <label>
                        Техническое средство реабилитации
                        <input class="form-control" name="equipmentName" value="${this.getValue('equipmentName')}" required>
                    </label>

                    <label>
                        Район
                        <input class="form-control" name="district" value="${this.getValue('district')}" required>
                    </label>

                    <label>
                        Статус
                        <select class="form-control" name="status">
                            <option value="новая" ${this.getValue('status', 'новая') === 'новая' ? 'selected' : ''}>новая</option>
                            <option value="в работе" ${this.getValue('status') === 'в работе' ? 'selected' : ''}>в работе</option>
                            <option value="выдано" ${this.getValue('status') === 'выдано' ? 'selected' : ''}>выдано</option>
                        </select>
                    </label>

                    <label>
                        Приоритет
                        <select class="form-control" name="priority">
                            <option value="обычная" ${this.getValue('priority', 'обычная') === 'обычная' ? 'selected' : ''}>обычная</option>
                            <option value="срочная" ${this.getValue('priority') === 'срочная' ? 'selected' : ''}>срочная</option>
                        </select>
                    </label>

                    <label>
                        Дата заявки
                        <input class="form-control" type="date" name="requestDate" value="${this.getValue('requestDate', new Date().toISOString().slice(0, 10))}">
                    </label>

                    <label class="form-field-wide">
                        Комментарий
                        <textarea class="form-control" name="comment" rows="4">${this.getValue('comment')}</textarea>
                    </label>

                    <div class="form-actions">
                        <button class="btn btn-primary" type="submit">${this.isEditMode ? 'Сохранить изменения' : 'Добавить заявку'}</button>
                        <button class="btn btn-secondary" type="button" id="cancel-form-btn">Отмена</button>
                    </div>
                </form>

                <div class="api-message" id="form-message"></div>
            </div>
        `;
    }

    getFormData() {
        const form = document.getElementById('rehab-request-form');
        const formData = new FormData(form);

        return {
            applicantName: formData.get('applicantName').trim(),
            applicantCategory: formData.get('applicantCategory').trim(),
            equipmentName: formData.get('equipmentName').trim(),
            district: formData.get('district').trim(),
            status: formData.get('status'),
            priority: formData.get('priority'),
            requestDate: formData.get('requestDate'),
            comment: formData.get('comment').trim()
        };
    }

    showMessage(message, type = 'info') {
        const messageBlock = document.getElementById('form-message');
        if (!messageBlock) return;
        messageBlock.className = `api-message api-message--${type}`;
        messageBlock.textContent = message;
    }

    goToMainPage() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    addListeners() {
        const backPlaceholder = document.querySelector('.back-button-placeholder');
        const backButton = new BackButtonComponent(backPlaceholder);
        backButton.render(this.goToMainPage.bind(this));

        document.getElementById('cancel-form-btn')?.addEventListener('click', () => {
            this.goToMainPage();
        });

        document.getElementById('rehab-request-form')?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const rehabRequestData = this.getFormData();

            try {
                if (this.isEditMode) {
                    await rehabRequestsApi.update(this.rehabRequest.id, rehabRequestData);
                    this.showMessage('Заявка успешно обновлена через XHR.', 'success');
                } else {
                    await rehabRequestsApi.create(rehabRequestData);
                    this.showMessage('Заявка успешно добавлена через XHR.', 'success');
                }

                setTimeout(() => this.goToMainPage(), 600);
            } catch (error) {
                this.showMessage(error.message || 'Не удалось сохранить заявку.', 'error');
            }
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners();
    }
}
