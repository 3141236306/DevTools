export class BaseComponent {
    constructor() {
        this.element = null;
        this.eventListeners = [];
    }
    
    render() {
        return '<div>Base Component</div>';
    }
    
    mount(container) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.render();
        container.appendChild(this.element);
        this.afterMount();
    }
    
    afterMount() {
        // 子类可以重写此方法来添加事件监听器
    }
    
    unmount() {
        this.removeEventListeners();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
    
    addEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            this.eventListeners.push({ element, event, handler });
        }
    }
    
    removeEventListeners() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        this.eventListeners = [];
    }
    
    querySelector(selector) {
        return this.element ? this.element.querySelector(selector) : null;
    }
    
    querySelectorAll(selector) {
        return this.element ? this.element.querySelectorAll(selector) : [];
    }
}