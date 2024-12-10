class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        setTimeout(() => {
            this.themeToggle = document.getElementById('theme-toggle');
            this.loadTheme();
            this.setupEventListeners();
        }, 100);
    }

    loadTheme() {
        chrome.storage.local.get(['theme'], (result) => {
            const theme = result.theme || 'light';
            this.applyTheme(theme);
        });
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
                chrome.storage.local.set({ theme: newTheme });
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update button icons visibility
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        }

        // Update header color
        const header = document.querySelector('.header');
        if (header) {
            header.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#2196F3';
        }

        // Update body background
        document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#f5f5f5';
    }
}

// Initialize theme manager when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
}); 