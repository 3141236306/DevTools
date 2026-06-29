import { HomePage } from './components/HomePage.js';
import { JsonTool } from './tools/JsonTool.js';
import { RegexTool } from './tools/RegexTool.js';
import { EncodeTool } from './tools/EncodeTool.js';
import { ColorTool } from './tools/ColorTool.js';
import { ImageTool } from './tools/ImageTool.js';
import { MediaTool } from './tools/MediaTool.js';
import { TechStack } from './tools/TechStack.js';
import { CalculatorTool } from './tools/CalculatorTool.js';
import { AiTool } from './tools/AiTool.js';

class App {
    constructor() {
        this.currentPage = null;
        this.routes = {
            'home': HomePage,
            'json': JsonTool,
            'regex': RegexTool,
            'encode': EncodeTool,
            'color': ColorTool,
            'image': ImageTool,
            'media': MediaTool,
            'tech': TechStack,
            'calc': CalculatorTool,
            'ai': AiTool
        };

        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileMenu();
        this.handleRoute();

        window.addEventListener('hashchange', () => this.handleRoute());
    }

    setupTheme() {
        const toggle = document.getElementById('themeToggle');
        const root = document.documentElement;

        toggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                window.location.hash = `#${page}`;
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateTo(hash);
    }

    navigateTo(pageName) {
        if (this.currentPage) {
            this.currentPage.unmount();
        }

        const ComponentClass = this.routes[pageName];
        if (ComponentClass) {
            this.currentPage = new ComponentClass();
            const container = document.getElementById('pageContainer');
            this.currentPage.mount(container);

            this.updateActiveNav(pageName);
            this.updateHash(pageName);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveNav(pageName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
    }

    updateHash(pageName) {
        const expected = `#${pageName}`;
        if (window.location.hash !== expected) {
            history.pushState(null, '', expected);
        }
    }
}

const app = new App();