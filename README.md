
# 🌤️ Responsive Weather App  
A modern, fully responsive Weather Application built using **HTML, CSS (Grid + Flex + Media Queries)**, and **JavaScript** with **OpenWeatherMap API** integration.  
The app provides real-time weather updates, 5-day forecast, automatic location detection, temperature unit conversion, and dynamic UI updates based on weather conditions.

---
## 📌 Features

### ✅ Current Location Weather
- Automatically fetches weather from the user’s **geolocation** on page load.
- Shows temperature, humidity, wind speed, and feels-like temperature.

### 🔍 City Search
- Users can search for any city worldwide.
- Handles **misspelled or invalid cities** with clean error messages.

### 🌡️ °C ↔ °F Toggle
- Switch temperature units instantly using a custom toggle button.
- Automatically reloads and converts all weather + forecast data.

### 🖼️ Dynamic Backgrounds
- Background gradient changes based on weather conditions:
  - ☀️ Clear  
  - ☁️ Clouds  
  - 🌧️ Rain  
  - ⛈️ Thunderstorm  
  - ❄️ Snow  
  - …and more.

### 📅 5-Day Forecast
- Uses OpenWeather API (3-hour intervals) and extracts **only the midday forecast** for each day.
- Fully responsive grid:
  - Desktop → 5 columns  
  - Tablet → 3 columns  
  - Mobile → 1 full-width row per day

### ⚡ Preloader Animation
- Smooth loading spinner appears during API fetch calls.

### 📱 Fully Responsive UI
Built using CSS **Grid** + **Flexbox** + **media queries**:
- Large Screens (desktop > 1440px): Expanded grid layout  
- Tablets (600px–1024px): Weather and details side-by-side  
- Mobile (< 600px): Stacked layout for perfect readability  

---

## 🛠️ Tech Stack

| Technology | Used For |
|-----------|----------|
| **HTML5** | Structure |
| **CSS3 (Grid/Flex/Media Queries)** | Layout & Responsiveness |
| **JavaScript (Vanilla JS)** | API calls & UI logic |
| **OpenWeatherMap API** | Weather + Forecast data |

---

## 🔧 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/weather-app.git
````

2. **Open the project folder**

```bash
cd weather-app
```

3. **Open `index.html` in your browser**

🔥 *Make sure to update your API key inside `script.js`:*

```js
const API = "YOUR_OPENWEATHER_API_KEY";
```

---

## 🌍 How It Works

### 📍 Fetch Weather by Location

```js
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
```

### 🔍 Fetch Weather by City

```js
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API}&units=${unit}`);
```

### 🌡️ Unit Conversion Toggle

```js
unit = unitToggle.checked ? "imperial" : "metric";
```

### 📅 Forecast Extraction

Extract midday forecast for each day:

```js
if (item.dt_txt.includes("12:00:00")) store.push(item);
```

---

## 📄 Folder Structure

```
weather-app/
│── index.html
│── style1.css
│── script.js
│── /images
│     ├── sun.png
│     ├── humidity.png
│     ├── windy.png
│     └── ...icons
│── README.md
```

---

## 💡 Future Improvements

* Add hourly forecast
* Add air quality index
* Add saved cities list

---

## 🙌 Author

**Krishna Khokhariya**
Frontend Developer | UI/UX Enthusiast

---

## ⭐ If you like this project, give it a GitHub star!



