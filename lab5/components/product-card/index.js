export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getStatusClass(status) {
        if (status === 'выдано') return 'rehab-status rehab-status--done';
        if (status === 'в работе') return 'rehab-status rehab-status--work';
        return 'rehab-status rehab-status--new';
    }

    getHTML(rehabRequest) {
        return `
            <div class="card rehab-request-card" data-id="${rehabRequest.id}">
                <img src="img/items.png" class="card-img-top" alt="${rehabRequest.equipmentName}">
                <div class="card-body">
                    <div class="rehab-card-header">
                        <h5 class="card-title">${rehabRequest.equipmentName}</h5>
                        <span class="${this.getStatusClass(rehabRequest.status)}">${rehabRequest.status}</span>
                    </div>
                    <p class="card-text"><strong>Заявитель:</strong> ${rehabRequest.applicantName}</p>
                    <p class="card-text"><strong>Категория:</strong> ${rehabRequest.applicantCategory}</p>
                    <p class="card-text"><strong>Район:</strong> ${rehabRequest.district}</p>
                    <p class="card-text"><strong>Приоритет:</strong> ${rehabRequest.priority}</p>
                    <div class="card-actions">
                        <button class="btn btn-primary details-btn" data-id="${rehabRequest.id}">Подробнее</button>
                        <button class="btn btn-secondary edit-btn" data-id="${rehabRequest.id}">Редактировать</button>
                        <button class="btn btn-danger delete-btn" data-id="${rehabRequest.id}">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(rehabRequest, listeners) {
        const card = this.parent.querySelector(`.card[data-id="${rehabRequest.id}"]`);
        if (!card) return;

        card.querySelector('.details-btn')?.addEventListener('click', () => listeners.onDetails(rehabRequest.id));
        card.querySelector('.edit-btn')?.addEventListener('click', () => listeners.onEdit(rehabRequest.id));
        card.querySelector('.delete-btn')?.addEventListener('click', () => listeners.onDelete(rehabRequest.id));
    }

    render(rehabRequest, listeners) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(rehabRequest));
        this.addListeners(rehabRequest, listeners);
    }
}
