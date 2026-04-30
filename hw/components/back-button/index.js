export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `<button id="back-button" class="btn btn-secondary back-button" type="button">← Назад</button>`;
    }

    addListeners(listener) {
        const backBtn = document.getElementById("back-button");
        if (backBtn) backBtn.addEventListener("click", listener);
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}