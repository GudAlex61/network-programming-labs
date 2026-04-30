export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card" data-id="${data.id}">
                <img src="${data.src}" class="card-img-top" alt="${data.title}">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">${data.text}</p>
                    <div class="contact-info">
                        <span class="phone-number">+7 (800) 555-12-34</span>
                        <button class="btn-call" data-phone="+78005551234">Позвонить</button>
                    </div>
                    <button class="btn btn-primary" data-id="${data.id}">Подробнее</button>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        // Кнопка "Подробнее"
        const detailBtn = this.parent.querySelector(`.card[data-id="${data.id}"] .btn-primary`);
        if (detailBtn) {
            detailBtn.addEventListener('click', listener);
        }
        // Кнопка звонка
        const callBtn = this.parent.querySelector(`.card[data-id="${data.id}"] .btn-call`);
        if (callBtn) {
            callBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `tel:${callBtn.getAttribute('data-phone')}`;
            });
        }
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}