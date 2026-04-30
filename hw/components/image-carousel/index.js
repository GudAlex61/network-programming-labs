export class ImageCarouselComponent {
    constructor(parent) {
        this.parent = parent;
        this.currentIndex = 0;
        this.images = [];
    }

    getHTML() {
        return `
            <div class="carousel-container">
                <img class="carousel-image" src="${this.images[this.currentIndex]}" alt="Изображение услуги">
                <button class="carousel-btn carousel-prev" id="carousel-prev">‹</button>
                <button class="carousel-btn carousel-next" id="carousel-next">›</button>
            </div>
        `;
    }

    updateImage() {
        const img = this.parent.querySelector('.carousel-image');
        if (img) {
            img.src = this.images[this.currentIndex];
        }
    }

    addListeners() {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
                this.updateImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                this.updateImage();
            });
        }
    }

    render(images) {
        if (!images || images.length === 0) return;
        this.images = images;
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners();
    }
}