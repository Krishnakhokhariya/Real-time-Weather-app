console.log("This is weather Application");

const API = 'b7cffca3b966f80a8296dddbf8388f3c';
let unit = 'metric'; //by default in c


let cityName = document.getElementById('cityName');
let getWeatherBtn = document.getElementById('getWeatherBtn');
let displayWeather = document.getElementById('displayWeather');
let forecastContainer = document.getElementById('forecastContainer');
let errorMeassage = document.querySelector('.error-message');
let unitToggle = document.getElementById('unitToggle');
let unitLabel = document.getElementById('unitLabel');

const weatherBackgrounds = {
  Clear: "linear-gradient(135deg, #f9d423, #ff4e50)",      
  Clouds: "linear-gradient(135deg, #bdc3c7, #2c3e50)",     
  Rain: "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)", 
  Drizzle: "linear-gradient(135deg, #89f7fe, #66a6ff)",
  Thunderstorm: "linear-gradient(135deg, #373B44, #4286f4)",
  Snow: "linear-gradient(135deg, #83a4d4, #b6fbff)",
  Mist: "linear-gradient(135deg, #606c88, #3f4c6b)",
  Smoke: "linear-gradient(135deg, #757f9a, #d7dde8)",
  Haze: "linear-gradient(135deg, #b9a7a7, #9d9a9a)",
  Fog: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
  Dust: "linear-gradient(135deg, #b79891, #94716b)",
  Sand: "linear-gradient(135deg, #fceabb, #f8b500)",
  Ash: "linear-gradient(135deg, #434343, #000000)",
  Squall: "linear-gradient(135deg, #3a6073, #16222a)",
  Tornado: "linear-gradient(135deg, #232526, #414345)"
};

//Show preloader
function showPreLoader(){
    document.getElementById("preloader").classList.remove('hidden');
}

//Hide Preloader
function hidePreLoader(){
    document.getElementById('preloader').classList.add('hidden');
}

function handleSearch(){
    const city = cityName.value.trim();
    if(city){
        fetchWeatherbyCity(city);
    }
}

// searchedcity button click event
getWeatherBtn.addEventListener("click", handleSearch);

//searched city by clicking enter key
cityName.addEventListener("keypress", (e)=>{
    if(e.key === "Enter"){
        handleSearch();
    }
});



// toggle button to change C to F
unitToggle.addEventListener("change", ()=>{
    unit = unitToggle.checked ? 'imperial': 'metric';
    unitLabel.textContent = unit === 'metric' ? '°C': '°F';
    console.log(`Unit switched to: ${unit}`);

    if(displayWeather.querySelector('.searchedCity')){
        let currentCity = displayWeather.querySelector(".searchedCity").textContent;
        fetchWeatherbyCity(currentCity);
    }
    else{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    let lat = position.coords.latitude;
                    let lon = position.coords.longitude;
                    fetchWeatherbyDefault(lat,lon);
                },
            ()=> fetchWeatherbyCity('Wellington')
        );
        }
        else{
            fetchWeatherbyCity('Wellington');
        }
    }
});


//by default user will get their current location weather
async function fetchWeatherbyDefault(lat, lon) {
    showPreLoader();
    try {
        const WeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=${unit}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=${unit}`;
        
        const [WeatherResponse, ForecastResponse] = await Promise.all([
            fetch(WeatherURL),
            fetch(forecastURL)
        ]);
        
        const data = await WeatherResponse.json();
        const forecastData = await ForecastResponse.json();

        if (data.cod != 200) {
            displayWeather.innerHTML = `<h2>Unable to Load current location Weather! </h2>`;
            forecastContainer.innerHTML = "";
            return;
        }

        updateWeatherUI(data);
        const fivedayForecast = getFiveDayForecast(forecastData);
        displayForecast(fivedayForecast);

    }
    catch (error) {
        console.error("Error fetching location Weather: ", error);
        displayWeather.innerHTML = `<h2>Oops... Couldn't fetch location weather!</h2>`;
        forecastContainer.innerHTML = '';
    }
    finally{
        hidePreLoader();
    }
}


// get temp of searched city by users
async function fetchWeatherbyCity(cityName) {
    showPreLoader();
    try {

        const WeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API}&units=${unit}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API}&units=${unit}`;
       
        const [WeatherResponse, ForecastResponse] = await Promise.all([
            fetch(WeatherURL),
            fetch(forecastURL)
        ]);

        const data = await WeatherResponse.json();
        const forecastData = await ForecastResponse.json();
        // console.log(forecastData);

        if(data.cod === "404"){
            displayWeather.style.display = "none";
            forecastContainer.style.display = "none";
            errorMeassage.textContent = "City Not Found!";
            errorMeassage.style.display = "flex";
            return;
        }
        
            displayWeather.style.display = "grid";
            forecastContainer.style.display = "block";
            errorMeassage.style.display = "none";
        

        // if (data.cod !== 200) {
        //     displayWeather.innerHTML = `<h2>City not Found!</h2>`;
        //     forecastContainer.innerHTML="";
        //     forecastContainer.style.display = 'none';
        //     return;
        // }

        updateWeatherUI(data);
        let fivedayForecast = getFiveDayForecast(forecastData);
        displayForecast(fivedayForecast);
        console.log(data);
    }
    catch (error) {
        console.error("Error fetching city Weather: ", error);
        errorMeassage.style.display = "flex";
        errorMeassage.textContent = `Oppss... Network Error!`;
        forecastContainer.style.display = "none";
        displayWeather.style.display = "none";
        forecastContainer.innerHTML="";
    }
    finally{
        hidePreLoader();
    }

}


//update wheater on button click event
function updateWeatherUI(data) {
    const icon = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    const WeatherType = data.weather[0].main;
    const background = weatherBackgrounds[WeatherType] || "linear-gradient(135deg, #74ebd5, #5b548a)";
    document.body.style.background = background;
    document.body.style.backgroundAttachment = "fixed";

    const tempUnit = unit === 'metric'?'°C': '°F';
    const windUnit = unit === 'metric'? 'km/h': 'mph';

    let weather = `
            <div class="displayTemp">
                <img src=${iconUrl} alt="weather image" id="weatherImg">
                <h1 class="temp">${Math.round(data.main.temp)}${tempUnit}</h1>
                <h2 class="searchedCity">${data.name}</h2>
            </div>
            <div class="weatherData">
            
                <div class="col">      
                    <label name="Humidity : " for="humidity" value="Humidity : ">Humidity: </label>
                    <div>
                        <p class="humidity"> ${data.main.humidity}%</p>
                    </div>
                </div>
                <div class="col">
                    
                    <label name="Wind : " for="wind" value="Wind : ">Wind: </label>
                    <div>
                        <p class="wind">${data.wind.speed} ${windUnit}</p>
                    </div>
                </div>
                <div class="col">
                    <label name="Feels like : " for="feelsLike" value="Feels like: ">Feels like: </label>
                    <div>
                        <p class="feelsLike">${data.main.feels_like}°C</p>
                    </div>
                </div>
            </div>`

    displayWeather.innerHTML = weather;

}


//get 1 forecast data out of many (data updates every 3 hours so there are muliple data for forecast so displayed only 12 noon data for each day) 
function getFiveDayForecast(data) {
    const daily = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        const time = item.dt_txt.split(" ")[1];


        //this will show only 12 noon temp 
        if (time === "12:00:00") {
            daily[date] = item;
        }
    });
    return Object.values(daily);
}


// update forecast container based on temp unit
function displayForecast(forecastData) {

    if(!forecastData || forecastData.length === 0){
        forecastContainer.style.display = "none";
        return;
    }

    forecastContainer.style.display = "grid";
    forecastContainer.innerHTML = "";
    const tempUnit = unit === 'metric'? '°C' : '°F';

    forecastData.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("en-GB", { 
            weekday: "short", 
            day: "numeric", 
            month: "short" });
        const forecastImg = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastContainer.innerHTML += `<div class="forecastDay">
                <p>${date}</p>
                <img src="${forecastImg}" alt="${day.weather[0].description}">
                <p> ${Math.round(day.main.temp)}${tempUnit} </p>
            </div>`;

    });
}

// onload function to ask user's permision to get their location
window.onload = () => {
    showPreLoader();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                fetchWeatherbyDefault(lat, lon);
            },
            (error) => {
                console.warn("Geolocation not allowed, loading deafult city...");
                fetchWeatherbyCity("Wellington");
            }
        );
    }
    else {
        fetchWeatherbyCity("Wellington");
    }
};









