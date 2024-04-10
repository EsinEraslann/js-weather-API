async function getCurrentWeather(city) {
    const apiKey = '7621091ca146b206a07f6f35c287603f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found. Please enter a valid city name.');
        }
        const data = await response.json();
        // Bugünkü hava durumu tahmini verilerini burada
        displayCurrentWeather(data);
        hideError(); // Doğru giriş yapıldığında hata mesajını gizle
        resetInputStyle(); // Doğru giriş yapıldığında border rengini sıfırla
        getFiveDayWeatherForecast(city); // Beş günlük hava durumu tahminleri
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        displayError(error.message); // Hata mesajını göster
        setInputErrorStyle(); // Yanlış giriş yapıldığında border rengini kırmızı yap
    }
}

function setInputErrorStyle() {
    const cityInput = document.getElementById('cityInput');
    cityInput.style.border = '2px solid red'; // Kırmızı border
}

function resetInputStyle() {
    const cityInput = document.getElementById('cityInput');
    cityInput.style.border = ''; // Border sıfırlama
}

function displayError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerText = message; // Hata mesajını göster
}

function hideError() {
    const errorDiv = document.getElementById('error');
    errorDiv.innerText = ''; // Hata mesajını temizle
}


function displayCurrentWeather(data, city) {
    const forecastDiv = document.getElementById('weatherCurrentForecast');
    forecastDiv.innerHTML = ''; // Temizleme

    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    // Açıklamaya uygun resmi tutan bir nesne
    const descriptionImages = {
        'clear sky': 'assets/img/clear-sky.png',
        'few clouds': 'assets/img/few-clouds.png',
        'scattered clouds': 'assets/img/scattered-clouds.png',
        'light rain': 'assets/img/rain.png',
        'shower rain': 'assets/img/shower-rain.png',
        'heavy intensity rain': 'assets/img/rain.png',
        'moderate rain': 'assets/img/rain.png',
        'broken clouds': 'assets/img/broken-clouds.png',
        'overcast clouds': 'assets/img/broken-clouds.png',
        'mist': 'assets/img/mist.png',
        'snow': 'assets/img/snow.png',
        'thunderstorm': 'assets/img/thunderstorm.png',
        // Diğer hava durumu açıklamaları ve resimleri
    };

    // Açıklamaya uygun resmi alın
    const imageSrc = descriptionImages[description.toLowerCase()] || 'default-image.png';

    const forecastItem = document.createElement('div');
    forecastItem.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Today's Weather:</p>
        <p>Temperature: ${temperature} °C</p>
        <p>Description: ${description}</p>
        <img src="${imageSrc}" alt="${description}"> 
        <hr>
    `;
    forecastDiv.appendChild(forecastItem);
}

async function getFiveDayWeatherForecast(city) {
    const apiKey = '7621091ca146b206a07f6f35c287603f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Açıklamaya uygun resimleri tutan bir nesne
    const descriptionImages = {
        'clear sky': 'assets/img/clear-sky.png',
        'few clouds': 'assets/img/few-clouds.png',
        'scattered clouds': 'assets/img/scattered-clouds.png',
        'light rain': 'assets/img/rain.png',
        'shower rain': 'assets/img/shower-rain.png',
        'heavy intensity rain': 'assets/img/rain.png',
        'moderate rain': 'assets/img/rain.png',
        'broken clouds': 'assets/img/broken-clouds.png',
        'overcast clouds': 'assets/img/broken-clouds.png',
        'mist': 'assets/img/mist.png',
        'snow': 'assets/img/snow.png',
        'thunderstorm': 'assets/img/thunderstorm.png',
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
    const forecastDiv = document.getElementById('weatherFiveDayForecast');
    forecastDiv.innerHTML = ''; // Temizleme

    const forecasts = data.list.filter((item, index) => index % 8 === 0 && index < 40); // Her günün ilk tahmini

    const forecastContainer = document.createElement('div');
    forecastContainer.style.display = 'flex'; // Yatay sıralama
    forecastDiv.appendChild(forecastContainer);

    forecasts.forEach(forecast => {
        const forecastTime = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;
        const iconCode = forecast.weather[0].icon;

        // Açıklamaya uygun resmi alın
        const imageSrc = descriptionImages[description.toLowerCase()] || 'default-image.png';

        const forecastItem = document.createElement('div');
        forecastItem.innerHTML = `
            <div style="margin-right: 20px;">
                <p>Date: ${forecastTime.toLocaleDateString()}</p>
                <p>Temperature: ${temperature} °C</p>
                <p>Description: ${description}</p>
                <img src="${imageSrc}" alt="${description}">
            </div>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Sayfa yenilemesini engelle

    const city = document.getElementById('cityInput').value;
    getCurrentWeather(city); // Bugünkü hava durumu tahmini
});
