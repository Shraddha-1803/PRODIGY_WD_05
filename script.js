const apiKey = "31cb6ea3eb452b97e092af6ebb29f28f";

async function fetchWeather(url) {
    const weatherResult = document.getElementById("weatherResult");

    weatherResult.innerHTML = `<p>Loading weather data...</p>`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.cod != 200) {
            weatherResult.innerHTML = `
                <p style="color: #ffdddd;">
                    ${data.message || "Location not found"}
                </p>
            `;
            return;
        }

        displayWeather(data);
    } catch (error) {
        weatherResult.innerHTML = `
            <p style="color: #ffdddd;">
                Error fetching weather data
            </p>
        `;
        console.error(error);
    }
}

function displayWeather(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>

        <img 
            src="${iconUrl}" 
            alt="Weather Icon"
            onerror="this.src='https://cdn-icons-png.flaticon.com/512/1779/1779940.png'"
        >

        <p class="temp">${Math.round(data.main.temp)}°C</p>
        <p style="text-transform: capitalize;">
            ${data.weather[0].description}
        </p>
        <p>🌡 Feels Like: ${Math.round(data.main.feels_like)}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function getWeatherByCity() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetchWeather(url);

    // Clear input after search
    cityInput.value = "";
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    document.getElementById("weatherResult").innerHTML =
        `<p>Fetching your location...</p>`;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetchWeather(url);
        },
        () => {
            document.getElementById("weatherResult").innerHTML = `
                <p style="color: #ffdddd;">
                    Unable to retrieve your location
                </p>
            `;
        }
    );
}