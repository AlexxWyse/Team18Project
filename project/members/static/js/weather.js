import  { expLongitude, expLatitude} from "./maps"


function getWeatherForLocation() {
    fetch("https://api.meteomatics.com/2023-05-17T00:00:00Z/t_2m:C/52.520551,13.461804/json")
      .then(response => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        } else {
          throw new Error("Error: Could not process response");
        }
      })
      .then(data => {
        console.log(data); // Log the parsed JSON data
      })
      .catch(error => {
        console.log("An error occurred:", error);
      });
  }
  


  getWeatherForLocation();
