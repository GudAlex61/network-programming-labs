import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { RehabRequestFormPage } from "../rehab-form/index.js";
import { rehabRequestsApi } from "../../services/rehabRequestsApi.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div id="main-page" class="container">
                <h1>Заявки на технические средства реабилитации</h1>

                <div class="api-toolbar">
                    <div class="filter-grid">
                        <label>
                            Статус
                            <input type="text" id="status-filter" class="form-control" placeholder="например: в работе">
                        </label>
                        <label>
                            Район
                            <input type="text" id="district-filter" class="form-control" placeholder="например: Тверской">
                        </label>
                        <label>
                            Средство реабилитации
                            <input type="text" id="equipment-filter" class="form-control" placeholder="например: кресло">
                        </label>
                    </div>

                    <div class="toolbar-actions">
                        <button class="btn btn-primary" id="apply-filter-btn">Фильтровать через API</button>
                        <button class="btn btn-secondary" id="reset-filter-btn">Сбросить</button>
                        <button class="btn btn-success" id="add-request-btn">Добавить заявку</button>
                    </div>
                </div>

                <div class="api-message" id="api-message"></div>
                <div class="cards-grid" id="cards-container"></div>
            </div>
        `;
    }

    getFilters() {
        return {
            status: document.getElementById('status-filter')?.value.trim() || '',
            district: document.getElementById('district-filter')?.value.trim() || '',
            equipmentName: document.getElementById('equipment-filter')?.value.trim() || ''
        };
    }

    showMessage(message, type = 'info') {
        const messageBlock = document.getElementById('api-message');
        if (!messageBlock) return;
        messageBlock.className = `api-message api-message--${type}`;
        messageBlock.textContent = message;
    }

    async loadRehabRequests(filters = {}) {
        const cardsContainer = document.getElementById('cards-container');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';
        this.showMessage('Загрузка заявок через XHR...', 'info');

        try {
            const rehabRequests = await rehabRequestsApi.getList(filters);

            if (!rehabRequests.length) {
                this.showMessage('По выбранным фильтрам заявок не найдено.', 'info');
                return;
            }

            this.showMessage(`Загружено заявок: ${rehabRequests.length}`, 'success');

            rehabRequests.forEach((rehabRequest) => {
                const card = new ProductCardComponent(cardsContainer);
                card.render(rehabRequest, {
                    onDetails: this.openDetailsPage.bind(this),
                    onEdit: this.openEditPage.bind(this),
                    onDelete: this.deleteRehabRequest.bind(this)
                });
            });
        } catch (error) {
            this.showMessage(error.message || 'Не удалось загрузить заявки.', 'error');
        }
    }

    async openDetailsPage(rehabRequestId) {
        try {
            const rehabRequest = await rehabRequestsApi.getOne(rehabRequestId);
            const productPage = new ProductPage(this.parent, rehabRequest);
            productPage.render();
        } catch (error) {
            this.showMessage(error.message || 'Не удалось открыть заявку.', 'error');
        }
    }

    async openEditPage(rehabRequestId) {
        try {
            const rehabRequest = await rehabRequestsApi.getOne(rehabRequestId);
            const formPage = new RehabRequestFormPage(this.parent, rehabRequest);
            formPage.render();
        } catch (error) {
            this.showMessage(error.message || 'Не удалось открыть редактирование.', 'error');
        }
    }

    async deleteRehabRequest(rehabRequestId) {
        const isConfirmed = confirm(`Удалить заявку №${rehabRequestId}?`);
        if (!isConfirmed) return;

        try {
            await rehabRequestsApi.remove(rehabRequestId);
            this.showMessage(`Заявка №${rehabRequestId} удалена.`, 'success');
            this.loadRehabRequests(this.getFilters());
        } catch (error) {
            this.showMessage(error.message || 'Не удалось удалить заявку.', 'error');
        }
    }

    addListeners() {
        document.getElementById('apply-filter-btn')?.addEventListener('click', () => {
            this.loadRehabRequests(this.getFilters());
        });

        document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
            document.getElementById('status-filter').value = '';
            document.getElementById('district-filter').value = '';
            document.getElementById('equipment-filter').value = '';
            this.loadRehabRequests();
        });

        document.getElementById('add-request-btn')?.addEventListener('click', () => {
            const formPage = new RehabRequestFormPage(this.parent);
            formPage.render();
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners();
        this.loadRehabRequests();
    }
}
