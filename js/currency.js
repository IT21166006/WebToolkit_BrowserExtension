class CurrencyWidget {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExchangeRates();
    }

    setupEventListeners() {
        const amountInput = document.getElementById('amount-input');
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        const swapButton = document.getElementById('swap-currency');

        if (amountInput) {
            amountInput.addEventListener('input', () => this.convertCurrency());
        }

        if (fromCurrency) {
            fromCurrency.addEventListener('change', () => this.convertCurrency());
        }

        if (toCurrency) {
            toCurrency.addEventListener('change', () => this.convertCurrency());
        }

        if (swapButton) {
            swapButton.addEventListener('click', () => this.swapCurrencies());
        }
    }

    async loadExchangeRates() {
        try {
            // Using exchangerate-api.com's free API
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            
            if (data.rates) {
                this.exchangeRates = data.rates;
                this.convertCurrency();
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            const rateInfo = document.getElementById('exchange-rate-info');
            if (rateInfo) {
                rateInfo.textContent = 'Failed to load exchange rates. Please try again later.';
            }
            console.error('Failed to load exchange rates:', error);
        }
    }

    convertCurrency() {
        if (!this.exchangeRates) return;

        const amountInput = document.getElementById('amount-input');
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        const resultInput = document.getElementById('result-input');
        const rateInfo = document.getElementById('exchange-rate-info');

        if (!amountInput || !fromCurrency || !toCurrency || !resultInput || !rateInfo) return;

        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount)) return;

        // Convert through USD (base currency)
        const amountInUSD = from === 'USD' 
            ? amount 
            : amount / this.exchangeRates[from];

        // Convert from USD to target currency
        const result = to === 'USD'
            ? amountInUSD
            : amountInUSD * this.exchangeRates[to];

        resultInput.value = result.toFixed(2);

        // Calculate and display the exchange rate
        const rate = (this.exchangeRates[to] / this.exchangeRates[from]);
        rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    }

    swapCurrencies() {
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        
        if (!fromCurrency || !toCurrency) return;

        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;

        this.convertCurrency();
    }
}

// Initialize the widget
const currencyWidget = new CurrencyWidget(); 