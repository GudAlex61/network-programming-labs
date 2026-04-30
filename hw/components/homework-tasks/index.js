class SocialHelpRequest {
    constructor(applicantName, requestInfo, requestedEquipment, issuedEquipment, serviceRoute, requestJournalText) {
        this.applicantName = applicantName;
        this.requestInfo = requestInfo;
        this.requestedEquipment = requestedEquipment;
        this.issuedEquipment = issuedEquipment;
        this.serviceRoute = serviceRoute;
        this.requestJournalText = requestJournalText;
    }

    getWaitingEquipment() {
        return diff(this.requestedEquipment, this.issuedEquipment);
    }

    getFlatServiceRoute() {
        return flatten(this.serviceRoute);
    }

    getVisibleJournalMessages() {
        const journalMessages = this.requestJournalText.split('|').map((journalMessage) => journalMessage.trim());
        const visibleJournalMessages = [];
        let currentJournalMessage = '';

        do {
            currentJournalMessage = journalMessages.shift();
            visibleJournalMessages.push(currentJournalMessage);
        } while (journalMessages.length > 0 && currentJournalMessage !== 'заявка закрыта');

        return visibleJournalMessages;
    }
}

function diff(firstEquipmentList, secondEquipmentList) {
    const issuedEquipmentSet = new Set(secondEquipmentList);
    return firstEquipmentList.filter((equipmentName) => !issuedEquipmentSet.has(equipmentName));
}

function flatten(nestedServiceRoute) {
    const flatServiceRoute = [];

    nestedServiceRoute.forEach((serviceRouteItem) => {
        if (Array.isArray(serviceRouteItem)) {
            flatServiceRoute.push(...flatten(serviceRouteItem));
        } else {
            flatServiceRoute.push(serviceRouteItem);
        }
    });

    return flatServiceRoute;
}

export class HomeworkTasksComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHomeworkRequest() {
        const requestInfo = {
            requestNumber: 'ТСР-Г3-024',
            district: 'район социального обслуживания',
            priority: 'срочная выдача'
        };
        const requestedEquipment = [
            'кресло-коляска',
            'пандус',
            'ходунки',
            'тактильная трость',
            'поручни'
        ];
        const issuedEquipment = ['кресло-коляска', 'ходунки'];
        const serviceRoute = [
            'приём заявления',
            ['проверка ИПРА', ['подбор ТСР', ['согласование доставки', 'выдача средства']]],
            'контроль качества услуги'
        ];
        const requestJournalText = 'заявка создана | документы проверены | оборудование подобрано | заявка закрыта | архивная запись';

        return new SocialHelpRequest(
            'Гражданин с заявкой на ТСР',
            requestInfo,
            requestedEquipment,
            issuedEquipment,
            serviceRoute,
            requestJournalText
        );
    }

    getHTML() {
        const socialHelpRequest = this.getHomeworkRequest();
        const waitingEquipment = socialHelpRequest.getWaitingEquipment();
        const flatServiceRoute = socialHelpRequest.getFlatServiceRoute();
        const visibleJournalMessages = socialHelpRequest.getVisibleJournalMessages();

        return `
            <section class="homework-block">
                <h2>Домашнее задание: задачи 2.4 и 3.3</h2>
                <p class="homework-block__description">
                    Данные адаптированы под тему услуг помощи инвалидам и технических средств реабилитации.
                </p>
                <div class="homework-grid">
                    <article class="homework-card">
                        <h3>Задание 2.4 — diff</h3>
                        <p>Функция показывает, какие средства реабилитации ещё не выданы заявителю.</p>
                        <p><strong>Запрошено:</strong> ${socialHelpRequest.requestedEquipment.join(', ')}</p>
                        <p><strong>Уже выдано:</strong> ${socialHelpRequest.issuedEquipment.join(', ')}</p>
                        <p><strong>Осталось выдать:</strong> ${waitingEquipment.join(', ')}</p>
                    </article>
                    <article class="homework-card">
                        <h3>Задание 3.3 — flatten</h3>
                        <p>Функция разворачивает вложенный маршрут оказания услуги в один общий список этапов.</p>
                        <p><strong>Маршрут:</strong> ${flatServiceRoute.join(' → ')}</p>
                    </article>
                    <article class="homework-card homework-card--wide">
                        <h3>Цикл с постусловием</h3>
                        <p>Журнал заявки читается через <code>do...while</code> до сообщения «заявка закрыта».</p>
                        <p><strong>Заявитель:</strong> ${socialHelpRequest.applicantName}</p>
                        <p><strong>Объект заявки:</strong> № ${socialHelpRequest.requestInfo.requestNumber}, ${socialHelpRequest.requestInfo.priority}</p>
                        <p><strong>Показанные сообщения:</strong> ${visibleJournalMessages.join(' → ')}</p>
                    </article>
                </div>
            </section>
        `;
    }

    render() {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
    }
}
