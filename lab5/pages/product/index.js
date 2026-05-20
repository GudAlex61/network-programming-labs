import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { RehabModelComponent } from "../../components/rehab-model/index.js";
import { RehabRequestFormPage } from "../rehab-form/index.js";

export class ProductPage {
    constructor(parent, rehabRequest) {
        this.parent = parent;
        this.rehabRequest = rehabRequest;
    }

    getHTML() {
        return `
            <div id="product-page" class="container">
                <div class="back-button-placeholder mb-3"></div>

                <div class="details-layout">
                    <div class="details-image-block">
                        <img src="img/items.png" class="details-main-image" alt="${this.rehabRequest.equipmentName}">
                    </div>

                    <div class="product-info-block api-details-card">
                        <h2>${this.rehabRequest.equipmentName}</h2>
                        <p><strong>ID заявки:</strong> ${this.rehabRequest.id}</p>
                        <p><strong>Заявитель:</strong> ${this.rehabRequest.applicantName}</p>
                        <p><strong>Категория:</strong> ${this.rehabRequest.applicantCategory}</p>
                        <p><strong>Район:</strong> ${this.rehabRequest.district}</p>
                        <p><strong>Статус:</strong> ${this.rehabRequest.status}</p>
                        <p><strong>Приоритет:</strong> ${this.rehabRequest.priority}</p>
                        <p><strong>Дата заявки:</strong> ${this.rehabRequest.requestDate}</p>
                        <p><strong>Комментарий:</strong> ${this.rehabRequest.comment || 'Комментарий не указан'}</p>
                        <button class="btn btn-secondary" id="edit-current-request-btn">Редактировать заявку</button>
                    </div>
                </div>

                <div class="rehab-model-placeholder"></div>
            </div>
        `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const backPlaceholder = document.querySelector('.back-button-placeholder');
        const backButton = new BackButtonComponent(backPlaceholder);
        backButton.render(this.clickBack.bind(this));

        document.getElementById('edit-current-request-btn')?.addEventListener('click', () => {
            const formPage = new RehabRequestFormPage(this.parent, this.rehabRequest);
            formPage.render();
        });

        const rehabModelPlaceholder = document.querySelector('.rehab-model-placeholder');
        const rehabModel = new RehabModelComponent(rehabModelPlaceholder);
        rehabModel.render();
    }
}
