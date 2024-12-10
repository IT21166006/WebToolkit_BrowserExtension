class PopupManager {
    constructor() {
        this.widgetContainer = document.querySelector('.widget-container');
        this.currentWidget = null;
        this.initializeButtons();
    }

    initializeButtons() {
        const buttons = {
            'weatherBtn': 'weather',
            'todoBtn': 'todo',
            'bookmarksBtn': 'bookmarks',
            'historyBtn': 'history',
            'speedBtn': 'speed',
            'notesBtn': 'notes',
            'passwordBtn': 'password',
            'currencyBtn': 'currency'
        };

        Object.entries(buttons).forEach(([btnId, widgetType]) => {
            const button = document.getElementById(btnId);
            if (button) {
                button.addEventListener('click', () => this.showWidget(widgetType));
            }
        });

        // Show weather widget by default after a short delay
        setTimeout(() => this.showWidget('weather'), 100);
    }

    showWidget(widgetType) {
        if (!this.widgetContainer) return;

        // Remove active class from all buttons
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        const activeButton = document.getElementById(`${widgetType}Btn`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Destroy current widget if it exists
        if (this.currentWidget && typeof this.currentWidget.destroy === 'function') {
            this.currentWidget.destroy();
        }
        
        // Clear current widget
        this.widgetContainer.innerHTML = '';
        
        // Load the appropriate widget
        try {
            switch(widgetType) {
                case 'weather':
                    this.loadWeatherWidget();
                    break;
                case 'todo':
                    this.loadTodoWidget();
                    break;
                case 'bookmarks':
                    this.loadBookmarksWidget();
                    break;
                case 'history':
                    this.loadHistoryWidget();
                    break;
                case 'speed':
                    this.loadSpeedWidget();
                    break;
                case 'notes':
                    this.loadNotesWidget();
                    break;
                case 'password':
                    this.loadPasswordWidget();
                    break;
                case 'currency':
                    this.loadCurrencyWidget();
                    break;
            }
        } catch (error) {
            console.error(`Error loading widget ${widgetType}:`, error);
            this.widgetContainer.innerHTML = `
                <div class="widget error-widget">
                    <h3>Error</h3>
                    <p>Failed to load widget. Please try again.</p>
                </div>
            `;
        }
    }

    loadWeatherWidget() {
        this.widgetContainer.innerHTML = `
            <div class="widget weather-widget">
                <h3>Weather</h3>
                <div class="weather-content">
                    <select id="location-select">
                        <option value="">Select Location</option>
                        <option value="london,uk">London</option>
                        <option value="new york,us">New York</option>
                        <option value="tokyo,jp">Tokyo</option>
                        <option value="paris,fr">Paris</option>
                    </select>
                    <div id="weather-info"></div>
                </div>
            </div>
        `;
        this.currentWidget = new WeatherWidget();
    }

    loadTodoWidget() {
        this.widgetContainer.innerHTML = `
            <div class="widget todo-widget">
                <h3>Todo List</h3>
                <div class="todo-content">
                    <input type="text" id="todo-input" placeholder="Add new task...">
                    <button id="add-todo">Add</button>
                    <ul id="todo-list"></ul>
                </div>
            </div>
        `;
        this.currentWidget = new TodoWidget();
    }

    loadBookmarksWidget() {
        this.widgetContainer.innerHTML = `
            <div class="widget bookmarks-widget">
                <h3>Quick Bookmarks</h3>
                <div id="bookmarks-list"></div>
            </div>
        `;
        this.currentWidget = new BookmarksWidget();
    }

    loadHistoryWidget() {
        this.widgetContainer.innerHTML = `
            <div class="widget history-widget">
                <h3>Recent History</h3>
                <div id="history-list"></div>
            </div>
        `;
        this.currentWidget = new HistoryWidget();
    }

    loadSpeedWidget() {
        this.currentWidget = new SpeedWidget();
    }

    loadNotesWidget() {
        this.currentWidget = new NotesWidget();
    }

    loadPasswordWidget() {
        this.widgetContainer.innerHTML = `
            <div class="widget password-widget">
                <h3>Password Generator</h3>
                <div class="password-content">
                    <div class="password-display">
                        <input type="text" id="generated-password" readonly>
                        <button id="copy-password" title="Copy to clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#795548">
                                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="password-options">
                        <div class="length-option">
                            <label for="password-length">Length: <span id="length-value">12</span></label>
                            <input type="range" id="password-length" min="8" max="32" value="12">
                        </div>
                        
                        <div class="checkbox-options">
                            <label>
                                <input type="checkbox" id="uppercase" checked>
                                Uppercase (A-Z)
                            </label>
                            <label>
                                <input type="checkbox" id="lowercase" checked>
                                Lowercase (a-z)
                            </label>
                            <label>
                                <input type="checkbox" id="numbers" checked>
                                Numbers (0-9)
                            </label>
                            <label>
                                <input type="checkbox" id="symbols" checked>
                                Symbols (!@#$%^&*)
                            </label>
                        </div>
                    </div>
                    
                    <button id="generate-password" class="generate-btn">Generate Password</button>
                </div>
            </div>
        `;
        this.currentWidget = new PasswordWidget();
    }

    loadCurrencyWidget() {
        this.widgetContainer.innerHTML = `
            <div class="widget currency-widget">
                <h3>Currency Converter</h3>
                <div class="currency-content">
                    <div class="currency-input">
                        <input type="number" id="amount-input" value="1" min="0" step="0.01">
                        <select id="from-currency">
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="NZD">NZD - New Zealand Dollar</option>
                        </select>
                    </div>
                    
                    <button id="swap-currency" class="swap-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#673AB7">
                            <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
                        </svg>
                    </button>
                    
                    <div class="currency-input">
                        <input type="number" id="result-input" readonly>
                        <select id="to-currency">
                            <option value="EUR">EUR - Euro</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="NZD">NZD - New Zealand Dollar</option>
                        </select>
                    </div>

                    <div class="exchange-rate" id="exchange-rate-info">
                        Loading exchange rates...
                    </div>
                </div>
            </div>
        `;
        this.currentWidget = new CurrencyWidget();
    }
}

// Initialize popup only when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.popupManager = new PopupManager();
}); 