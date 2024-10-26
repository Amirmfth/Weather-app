const API_KEY = "1a32f78102ae1c400d50243389cd8a3b";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const searchInp = document.querySelector("input");
const searchBtn = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const locationIcon = document.getElementById("location")

const gerCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
const gerCurrentWeatherBycoordinates = async (lat , lon) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};



const renderCurrentWeather = (data) => {
  const weatherJSX = `
        <h1>${data.name} , ${data.sys.country}</h1>
        <div id="main">
            <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"  alt="weather icon"/>
            <span>${data.weather[0].main}</span>
            <p>${Math.round(data.main.temp)}°C</p>
        </div>
        <div id="info">
            <p>Humidity: <span>${data.main.humidity}%</span></p>
            <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
        </div>
    `;
  weatherContainer.innerHTML = weatherJSX;
};

const searchHandler = async () => {
  const cityName = searchInp.value;
  if (!cityName) {
    alert("Please enter city name");
  }
  const currentData = await gerCurrentWeatherByName(cityName);
  renderCurrentWeather(currentData);
};

const positionCB = async (position) => {
    const {latitude , longitude} = position.coords
    const currentData = await gerCurrentWeatherBycoordinates(latitude , longitude)
    renderCurrentWeather(currentData)
}

const errorCB = (error) => {
    console.log(error.message)
}

const locationHandler = () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionCB , errorCB)
    }else {
        alert("Your browser does not support geolocation")
    }
}

searchBtn.addEventListener("click", searchHandler);
locationIcon.addEventListener("click" , locationHandler)
