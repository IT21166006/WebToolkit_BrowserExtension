const WEATHER_API_KEY = '0aefe3ea8d1542baa1b5f9b999e8e856'; // Replace with your actual API key

class WeatherWidget {
    constructor() {
        this.init();
    }

    init() {
        const widgetContainer = document.querySelector('.widget-container');
        if (!widgetContainer) return;

        widgetContainer.innerHTML = `
            <div class="widget weather-widget">
                <h3>Weather</h3>
                <div class="weather-content">
                    <div class="weather-search">
                        <input type="text" id="location-input" placeholder="Enter city name...">
                        <button id="search-weather">Search</button>
                    </div>
                    <div id="weather-info"></div>
                </div>
            </div>
        `;

        this.locationInput = document.getElementById('location-input');
        this.searchButton = document.getElementById('search-weather');
        this.weatherInfo = document.getElementById('weather-info');

        this.setupEventListeners();
        this.loadLastLocation();
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.updateWeather());
        this.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.updateWeather();
            }
        });
    }

    loadLastLocation() {
        chrome.storage.local.get(['lastLocation'], (result) => {
            if (result.lastLocation) {
                this.locationInput.value = result.lastLocation;
                this.updateWeather();
            }
        });
    }

    async updateWeather() {
        const location = this.locationInput.value.trim();
        if (!location) {
            this.showError('Please enter a city name');
            return;
        }

        // Save location
        chrome.storage.local.set({ lastLocation: location });

        try {
            this.weatherInfo.innerHTML = '<p>Loading...</p>';
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();

            this.weatherInfo.innerHTML = `
                <div class="weather-details">
                    <h4>${data.name}, ${data.sys.country}</h4>
                    <p>${Math.round(data.main.temp)}°C</p>
                    <p>${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind: ${Math.round(data.wind.speed * 3.6)} km/h</p>
                </div>
            `;
        } catch (error) {
            this.showError(error.message === 'City not found' ? 
                'City not found. Please check the spelling.' : 
                'Failed to load weather data');
        }
    }

    showError(message) {
        this.weatherInfo.innerHTML = `
            <div class="weather-error">
                ${message}
            </div>
        `;
    }
}

// Initialize the widget
const weatherWidget = new WeatherWidget(); 