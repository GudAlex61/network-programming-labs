import { ProductCardComponent } from "../../components/product-card/index.js";
import { InformerComponent } from "../../components/informer/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page" class="container">
                <h1>Услуги помощи инвалидам</h1>
                <div class="informer-placeholder text-center mb-4"></div>
                <div class="cards-grid" id="cards-container"></div>
            </div>
        `;
    }

    getData() {
        return [
            {
                id: 1,
                src: "img/worker.png",
                title: "Социальный работник",
                text: "Помощь на дому: уход, сопровождение, бытовые услуги",
                images: [
                    "img/worker1.png",
                    "img/worker2.png",
                    "img/worker3.png"
                ],
                fullText: "Квалифицированные социальные работники помогают на дому: приготовление пищи, уборка, помощь в гигиенических процедурах, сопровождение в поликлинику. Услуга предоставляется бесплатно при наличии направления от органов соцзащиты."
            },
            {
                id: 2,
                src: "img/items.png",
                title: "Технические средства реабилитации",
                text: "Коляски, ходунки, слуховые аппараты – подбор и выдача",
                images: [
                    "img/items1.png",
                    "img/items2.png",
                    "img/items3.png"
                ],
                fullText: "Индивидуальный подбор и выдача кресел-колясок, ходунков, тростей, слуховых аппаратов и других средств реабилитации. Возможен ремонт и сервисное обслуживание."
            },
            {
                id: 3,
                src: "img/support.png",
                title: "Психологическая поддержка",
                text: "Консультации психолога, группы взаимопомощи",
                images: [
                    "img/support1.png",
                    "img/support2.png",
                    "img/support3.png"
                ],
                fullText: "Бесплатные консультации психолога, в том числе для родственников. Группы взаимопомощи, тренинги по адаптации, кризисная поддержка."
            }
        ];
    }

    clickCard(e) {
        // Находим карточку по id кнопки
        const button = e.target.closest('.btn-primary');
        if (!button) return;
        const cardId = parseInt(button.getAttribute('data-id'));
        const serviceData = this.getData().find(item => item.id === cardId);
        if (serviceData) {
            const productPage = new ProductPage(this.parent, serviceData);
            productPage.render();
        }
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const informerPlaceholder = document.querySelector('.informer-placeholder');
        const informer = new InformerComponent(informerPlaceholder);
        informer.render();

        const cardsContainer = document.getElementById('cards-container');
        const data = this.getData();
        data.forEach(item => {
            const card = new ProductCardComponent(cardsContainer);
            card.render(item, this.clickCard.bind(this));
        });
    }
}