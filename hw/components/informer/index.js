export class InformerComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <button type="button" 
                    class="btn btn-primary informer-btn" 
                    id="informerBtn" 
                    data-bs-toggle="popover" 
                    data-bs-placement="bottom" 
                    data-bs-html="true"
                    data-bs-title=" Информер помощи" 
                    data-bs-content="
                        <strong>Новость:</strong> С 1 мая упрощён порядок получения ТСР.<br>
                        <strong>Совет:</strong> Запишитесь на бесплатную консультацию юриста.<br>
                        <strong>Мероприятие:</strong> Вебинар 'Доступная среда' – 25 апреля.<br>
                        <hr class='my-2' style='border-color: #d32f2f;'>
                        <small class='text-muted'>Актуально до 30.04.2026</small>
                    ">
                Получить актуальную информацию
            </button>
        `;
    }

    render() {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const popoverBtn = document.getElementById('informerBtn');
        if (popoverBtn) {
            new bootstrap.Popover(popoverBtn, {
                trigger: 'click'
            });
        }
    }
}