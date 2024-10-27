import getWeatherData from "./utils/httpReg.js";
import { removeModal, showModal } from "./utils/modal.js";
import { getWeekDay } from "./utils/customDate.js";

const searchInp = document.querySelector("input");
const searchBtn = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");
const modalButton = document.getElementById("modal-button");

const renderCurrentWeather = (data) => {
  if (!data) return;
  const weatherJSX = `
        <h1>${data.name} , ${data.sys.country}</h1>
        <div id="main">
            <img src="https://openweathermap.org/img/w/${
              data.weather[0].icon
            }.png"  alt="weather icon"/>
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

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJSX = `
            <div>
                <img src="https://openweathermap.org/img/w/${
                  i.weather[0].icon
                }.png"  alt="weather icon"/>
                <h3>${getWeekDay(i.dt)}</h3>
                <p>${Math.round(i.main.temp)}°C</p>
                <span>${i.weather[0].main}</span>
            </div>
        `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInp.value;
  if (!cityName) {
    showModal("Please enter city name");
    return;
  }
  weatherContainer.innerHTML = `<span id="loader"></span>`;
  forecastContainer.innerHTML = "";
  const currentData = await getWeatherData("current", cityName);
  const forecastData = await getWeatherData("forecast", cityName);
  renderCurrentWeather(currentData);
  renderForecastWeather(forecastData);
};

const positionCB = async (position) => {
  searchInp.value = "";
  weatherContainer.innerHTML = `<span id="loader"></span>`;
  forecastContainer.innerHTML = "";
  const currentData = await getWeatherData("current", position.coords);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderCurrentWeather(currentData);
  renderForecastWeather(forecastData);
};

const errorCB = (error) => {
  showModal(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCB, errorCB);
  } else {
    showModal("Your browser does not support geolocation");
    return;
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "tehran");
  const forecastData = await getWeatherData("forecast", "tehran");
  renderCurrentWeather(currentData);
  renderForecastWeather(forecastData);
};

searchBtn.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
