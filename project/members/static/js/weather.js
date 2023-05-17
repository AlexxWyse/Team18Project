// import { expLongitude, expLatitude } from "./maps.js"
const APIKEY = "d0b6c9ade1db30fe160940ff847a63cb"

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
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
  }
  

  
  getWeatherForLocation();
