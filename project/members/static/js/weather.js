// import { expLongitude, expLatitude } from "./maps.js"
const APIKEY = "d0b6c9ade1db30fe160940ff847a63cb"
const map = document.getElementById("map");


function getWeatherForLocation() {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${49.246292}&lon=${-123.116226}&appid=${APIKEY}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  })
  .then(data => {
    const temperatureInKelvin = data.current["temp"];
    const precipitation = data.current.weather[0]["main"];
    const temperatureInCelsius = temperatureInKelvin - 273.15;
    const weatherIcon = data.current.weather[0]["icon"];
    console.log(`Temperature: ${temperatureInCelsius.toFixed(2)}°C`)
    console.log(precipitation);
    console.log(data);
    console.log(tempimage);

    let div = document.getElementById("weather");
    let currentWeather = document.createElement("p")
    currentWeather.textContent = `Temperature: ${temperatureInCelsius.toFixed(2)}°C, Precipitation: ${precipitation}`;
    let weatherImage = document.createElement("img")
    weatherImage.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`
    div.appendChild(currentWeather);

})
  .catch(error => {
    console.error(error);
  });
  };
  

  
  map.addEventListener("click", getWeatherForLocation)
