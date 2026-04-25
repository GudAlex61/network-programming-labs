import { BackButtonComponent } from "../../components/back-button/index.js";
import { ImageCarouselComponent } from "../../components/image-carousel/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
    constructor(parent, serviceData) {
        this.parent = parent;
        this.serviceData = serviceData;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div id="product-page" class="container">
                <div class="back-button-placeholder mb-3"></div>
                <div id="carousel-placeholder"></div>
                <div class="product-info-block">
                    <h2>${this.serviceData.title}</h2>
                    <p>${this.serviceData.fullText}</p>
                </div>
                <div class="contact-info mt-4">
                    <h5>По вопросам услуги:</h5>
                    <p>Горячая линия: <strong>8-800-555-12-34</strong></p>
                    <p>Email: support@social-help.ru</p>
                    <button class="btn btn-call" id="callNowBtn">Позвонить сейчас</button>
                </div>
            </div>
        `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backPlaceholder = document.querySelector('.back-button-placeholder');
        const backButton = new BackButtonComponent(backPlaceholder);
        backButton.render(this.clickBack.bind(this));

        const carouselPlaceholder = document.getElementById('carousel-placeholder');
        const carousel = new ImageCarouselComponent(carouselPlaceholder);
        carousel.render(this.serviceData.images);

        const callNowBtn = document.getElementById('callNowBtn');
        if (callNowBtn) {
            callNowBtn.addEventListener('click', () => {
                window.location.href = 'tel:+78005551234';
            });
        }
    }
}