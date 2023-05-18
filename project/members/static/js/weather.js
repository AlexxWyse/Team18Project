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

    const week = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday"
    }

    let dailyWeather = data.daily
    let weekWeather = [];

    for (let index = 0; index < dailyWeather.length; index++) {
        
        let temp = dailyWeather[index].temp["day"];
        let weatherIcon = dailyWeather[index].weather[0]["icon"]; 

        let day = {
            "weekday": week[index],
            "data": [`${(temp - 273.15).toFixed(2)}°C`, dailyWeather[index].weather[0]["main"], weatherIcon]
        }
        weekWeather.push(day)  
    }

    const weekDay = document.getElementById("weatherdisplay");
    
    for (let i = 0; i < weekWeather.length; i++) {
        const dayData = weekWeather[i];
        const dayWeatherIcon = weekWeather[i].data[2]
        
        const dayDiv = document.createElement("div");
        const dayImage = document.createElement("img");
        dayImage.src = dayWeatherIcon;
        const dayContext = document.createElement("p");
        
        dayContext.textContent = `${dayData.weekday}: ${dayData.data[0]}\n ${dayData.data[1]}`;

        
        // Append the paragraph to the dayDiv
        dayDiv.appendChild(dayContext);
        dayDiv.appendChild(dayImage);
        // Append the dayDiv to the weatherdisplay element
        weekDay.appendChild(dayDiv);
      }
    // console.log(weekWeather)  
    // let dayDiv = document.createElement("div");
    // let dayContext = document.createElement("p");
    // dayContext.textContent()
})
  .catch(error => {
    console.error(error);
  });
  };
  

  
  map.addEventListener("click", getWeatherForLocation)
