// Load env then initialize
importScript('../shared/env-loader.js').then(() => {
    initApp();
});

function importScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

let apiKey = "";

async function initApp() {
    const env = await loadEnv();
    apiKey = env.WEATHER_API_KEY || "1a96e379e9d37303cef04dfe387da861";
}

const searchBtn = document.getElementById('searchBtn');
// Key will be checked in getWeather

const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorDisplay = document.getElementById('errorDisplay');
const loader = document.getElementById('loader');

searchBtn.addEventListener('click', () => getWeather());
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') getWeather();
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    // UI States
    weatherDisplay.classList.add('hidden');
    errorDisplay.classList.add('hidden');
    loader.classList.remove('hidden');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        loader.classList.add('hidden');

        if (data.cod === 200) {
            updateUI(data);
            weatherDisplay.classList.remove('hidden');
        } else {
            errorDisplay.classList.remove('hidden');
        }
    } catch (error) {
        console.error(error);
        loader.classList.add('hidden');
        errorDisplay.classList.remove('hidden');
    }
}

function updateUI(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('country').textContent = data.sys.country;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('condition').textContent = data.weather[0].description;

    document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like) + '°';
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('windSpeed').textContent = (data.wind.speed * 3.6).toFixed(1) + ' km/h';
    document.getElementById('visibility').textContent = (data.visibility / 1000).toFixed(1) + ' km';

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('sunrise').textContent = sunrise;
    document.getElementById('sunset').textContent = sunset;

    updateTheme(data.main.temp, data.weather[0].main);
}

function updateTheme(temp, condition) {
    document.body.className = ''; // Reset

    if (condition.toLowerCase().includes('rain')) {
        document.body.classList.add('rain');
    } else if (temp <= 10) {
        document.body.classList.add('cold');
    } else if (temp <= 20) {
        document.body.classList.add('cool');
    } else if (temp <= 30) {
        document.body.classList.add('warm');
    } else {
        document.body.classList.add('hot');
    }
}
