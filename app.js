async function getCurrentWeather(city) {
    const apiKey = '7621091ca146b206a07f6f35c287603f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Bugünkü hava durumu tahmini verilerini burada
        displayCurrentWeather(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayCurrentWeather(data) {
    const forecastDiv = document.getElementById('weatherForecast');
    forecastDiv.innerHTML = ''; // Temizleme

    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    // Açıklamaya uygun resimleri tutan bir nesne
    const descriptionImages = {
        'clear sky': 'clear-sky.png',
        'few clouds': 'assets/img/few-clouds.png',
        'scattered clouds': 'scattered-clouds.png',
        // Diğer hava durumu açıklamaları ve resimleri
    };

    // Açıklamaya uygun resmi alın
    const imageSrc = descriptionImages[description.toLowerCase()] || 'default-image.png';

    const forecastItem = document.createElement('div');
    forecastItem.innerHTML = `
        <p>Today's Weather:</p>
        <p>Temperature: ${temperature} °C</p>
        <p>Description: ${description}</p>
        <img src="${imageSrc}" alt="${description}"> 
    `;
    forecastDiv.appendChild(forecastItem);
}

async function getFiveDayWeatherForecast(city) {
    const apiKey = '7621091ca146b206a07f6f35c287603f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Açıklamaya uygun resimleri tutan bir nesne
    const descriptionImages = {
        'clear sky': 'clear-sky.png',
        'few clouds': 'assets/img/few-clouds.png',
        'overcast clouds': '',
        'broken clouds': '',
        'scattered clouds': 'scattered-clouds.png',
        'light rain': 'scattered-clouds.png',
        // Diğer hava durumu açıklamaları ve resimleri
    };

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Beş günlük hava durumu tahmini verilerini burada
        displayFiveDayWeatherForecast(data, descriptionImages);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayFiveDayWeatherForecast(data, descriptionImages) {
    const forecastDiv = document.getElementById('weatherForecast');

    const forecasts = data.list.filter((item, index) => index % 8 === 0 && index < 40); // Her günün ilk tahmini

    forecasts.forEach(forecast => {
        const forecastTime = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const iconCode = forecast.weather[0].icon;

        // Açıklamaya uygun resmi alın
        const imageSrc = descriptionImages[description.toLowerCase()] || 'default-image.png';

        const forecastItem = document.createElement('div');
        forecastItem.innerHTML = `
            <p>Date: ${forecastTime.toLocaleDateString()}</p>
            <p>Temperature: ${temperature} °C</p>
            <p>Description: ${description}</p>
            <img src="${imageSrc}" alt="${description}"> 
            <hr>
        `;
        forecastDiv.appendChild(forecastItem);
    });
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Sayfa yenilemesini engelle

    const city = document.getElementById('cityInput').value;
    getCurrentWeather(city); // Bugünkü hava durumu tahmini
    getFiveDayWeatherForecast(city); // Beş günlük hava durumu tahminleri
});