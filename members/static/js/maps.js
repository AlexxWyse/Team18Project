import { RESTAURANTS, TOURIST_ATTRACTIONS, HOTELS } from "./placeTypes.js";
let map, popup, Popup;

function handleSave(itenarary_item) {
  itenarary_saves.push(itenarary_item);
  const list = document.getElementById("list");
  const div = document.createElement("div");
  const p = document.createElement("p");
  for (let key in itenarary_item) {
    p.innerHTML += `<strong><u>${key}</u></strong>: ${itenarary_item[key]} <br>`;
  }
  div.appendChild(p);
  div.className = "itenarary_item";
  list.appendChild(div);
}

function getLocationInfo(location) {
  let locationTypes = [];
  // console.log(locationInformation);
  for (let type of location.types) {
    if (
      type === "restaurant" ||
      type === "lodging" ||
      type === "tourist_attraction"
    ) {
      locationTypes.push(type);
    }
  }
  if (locationTypes.length === 0) {
    locationTypes.push(location.types[0]);
  }

  console.log(location);
  return {
    address: location.vicinity ? location.vicinity : location.formatted_address,
    name: location.name,
    total_num_ratings: location.user_ratings_total,
    rating: location.rating,
    type: locationTypes,
  };
}

console.log(RESTAURANTS);
let itenarary_saves = [];
let places;
//>>>>
// let infoWindow;
// let autocomplete;
let markers = [];
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";

function displayDropDown() {
  document.getElementById("dropdown").classList.toggle("display");
}

window.addEventListener("click", function (event) {
  if (!event.target.matches("#select-button")) {
    let dropdowns = document.getElementsByClassName("dropdown-buttons");
    for (let dropdown of dropdowns) {
      let openDropDown = dropdown;
      if (openDropDown.classList.contains("display")) {
        openDropDown.classList.remove("display");
      }
    }
  }
});

document
  .getElementById("select-button")
  .addEventListener("click", displayDropDown);

function initMap() {
  const startLatLng = { lat: 49.2827, lng: -123.1207 };
  const options = {
    zoom: 14,
    center: startLatLng,
  };
  //credit: https://developers.google.com/maps/documentation/javascript/examples/overlay-popup
  /**
   * A customized popup on the map.
   */
  class Popup extends google.maps.OverlayView {
    position;
    containerDiv;
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add("popup-bubble");

      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");

      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position
      );
      // Hide the popup when it is far out of view.
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? "block"
          : "none";

      if (display === "block") {
        this.containerDiv.style.left = divPosition.x + "px";
        this.containerDiv.style.top = divPosition.y + "px";
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }
  }

  // let popupContent = document.createElement("div");
  // let searchSaveButton;
  // popupcContent.innerHTML = "";
  // popup = new Popup(
  //   new google.maps.LatLng(-33.866, 151.196),
  //   document.getElementById("content")
  // );
  // popup.setMap(map);

  const map = new google.maps.Map(document.getElementById("map"), options);
  places = new google.maps.places.PlacesService(map);
  let location_info = [];

  //search bar
  let input = document.getElementById("search");
  let clear = document.getElementById("clear-button");
  let searchBox = new google.maps.places.SearchBox(input);
  clear.addEventListener("click", () => {
    input.value = "";
  });
  //makes sure that the search is only limited to the bounds of the map box
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];
  searchBox.addListener("places_changed", function () {
    let places = searchBox.getPlaces();
    //if array is empty dont want to do any other work with places
    if (places.length === 0) {
      return;
    }
    //takes callback function taking the curernt marker for that iteration and using null to get rid of the map reference
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    //re-init to an empty array
    markers = [];
    let bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        return;
      }
      console.log(">>> jy place", place);
      let marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
        placeResult: place,
      });
      marker.content = createPopupContent(marker, marker.placeResult);

      markers.push(marker);

      console.log("coordinates", place.geometry.location.lat());
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    //>>>>>

    // markers[i].placeResult = results[i];
    // google.maps.event.addListener(markers[i], "click", showInfoWindow);
    // google.maps.event.addListener(marker, "click", () =>
    //   displayInfoWindow(marker, place)
    // );

    markers.forEach((marker) => {
      // let infoWindow = new google.maps.InfoWindow({
      //   content: marker.content,
      // });
      marker.addListener("click", function () {
        // displayInfoWindow(marker, place);
        // console.log(">>>>inside marker", marker, "placeREsult", marker.content);
        // let popupInfoWindow = new Popup{
        //   marker.position,
        // };
        displayPopup(marker, marker.placeResult);
      });
      // marker.addListener("click", function () {
      //   infoWindow.open(map, marker);
      // });
      location_info.push({
        index: [{ lat: marker.lat }, { lng: marker.lng }],
      });
      // index += 1;
      console.log("marker bounds test", location_info);
    });
    map.fitBounds(bounds);
  });
  //credit: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch
  function dropMarker(i) {
    return function () {
      markers[i].setMap(map);
    };
  }

  function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }

    markers = [];
  }

  function filter(type) {
    const search = {
      bounds: map.getBounds(),
      types: [type],
    };
    places.nearbySearch(search, (results, status, pagniation) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // console.log(results);
        clearResults();
        clearMarkers();
        for (let i = 0; i < results.length; i++) {
          const markerLetter = String.fromCharCode(
            "A".charCodeAt(0) + (i % 26)
          );
          const markerIcon = MARKER_PATH + markerLetter + ".png";
          markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
          });
          // If the user clicks a hotel marker, show the details of that hotel
          // in an info window.
          // @ts-ignore TODO refactor to avoid storing on marker
          markers[i].placeResult = results[i];
          google.maps.event.addListener(markers[i], "click", displayInfoWindow);
          // google.maps.event.addListener(markers[i], "click", () =>
          //   displayPopup(markers[i], results[i])
          // );

          setTimeout(dropMarker(i), i * 100);
          addResult(results[i], i);
        }
      }
    });
  }

  function createPopupContent(marker, place) {
    let container = document.createElement("div");
    let button = document.createElement("button");
    button.innerText = "Save";
    button.className = "filterSaveButton";
    button.addEventListener("click", () => {
      let info = getLocationInfo(place);
      handleSave(info);
    });

    container.className = "popupContent";
    container.innerHTML = `${marker.placeResult.name} <br> average rating: ${marker.placeResult.rating} <br> total number of user ratings:  ${marker.placeResult.user_ratings_total} <br> ${marker.placeResult.vicinity} `;
    container.appendChild(button);
    return container;
  }

  function displayPopup(marker, place) {
    let content = createPopupContent(marker, place);
    console.log("marker position", marker.position.lat);
    // let popup = new Popup(new google.maps.LatLng(49.2827, -123.1207), content);
    let popup = new Popup(marker.position, content);
    map.addListener("click", function () {
      popup.setMap(null);
    });
    popup.setMap(map);
  }

  let restaurantButton = document.getElementById("restaurants");
  let hotelsButton = document.getElementById("hotels");
  let touristAttractionsButton = document.getElementById("tourist_attractions");
  restaurantButton.addEventListener("click", () => filter(RESTAURANTS));
  hotelsButton.addEventListener("click", () => filter(HOTELS)); //
  touristAttractionsButton.addEventListener("click", () =>
    filter(TOURIST_ATTRACTIONS)
  );
}
function displayInfoWindow() {
  let marker = this;
  let infoWindow = new google.maps.InfoWindow({
    content: ` ${marker.placeResult.name} <br> average rating: ${marker.placeResult.rating} <br> total number of user ratings:  ${marker.placeResult.user_ratings_total} <br> ${marker.placeResult.vicinity} `,
  });
  infoWindow.open(map, marker);
}

// credit: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch
function clearResults() {
  const results = document.getElementById("results");

  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

function addResult(result, i) {
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");

  tr.style.backgroundColor = i % 2 === 0 ? "#F6E0B3" : "#FFFFE0";
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], "click");
  };

  const iconTd = document.createElement("td");
  const nameTd = document.createElement("td");
  const icon = document.createElement("img");
  const button = document.createElement("button");
  button.innerText = "Save";
  icon.src = markerIcon;
  icon.setAttribute("class", "placeIcon");
  icon.setAttribute("className", "placeIcon");

  const name = document.createTextNode(result.name);
  let itenarary_item = getLocationInfo(result);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
  tr.appendChild(button);
  button.addEventListener("click", () => handleSave(itenarary_item));
}

window.initMap = initMap;

function saveBusinesses() {
  console.log("Save button has been clicked");
  let businessData = itenarary_saves;
  fetch("/business/new/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(businessData),
  })
    .then((response) => response.json())
    .then((result) => {
      // Handle the response from the Django backend
      console.log(result);
      itenarary_saves = []; // Clear the array
      businessData = [];
      var businesses = document.getElementsByClassName("itenarary_item");
      while (businesses.length > 0) {
        businesses[0].remove();
      }
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}

const businessSaveButton = document.getElementById("save-button");
businessSaveButton.addEventListener("click", saveBusinesses);
window.addEventListener("click", function (event) {
  if (!event.target.matches("#select-button")) {
    let dropdowns = document.getElementsByClassName("dropdown-buttons");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropDown = dropdowns[i];
      if (openDropDown.classList.contains("display")) {
        openDropDown.classList.remove("display");
      }
    }
  }
});

const googleMapsScript = document.createElement("script");
googleMapsScript.src =
  "https://maps.googleapis.com/maps/api/js?language=en&key=AIzaSyCEE6-JSPCe6zNZuAoIPog0ELD2-UyO3CM&libraries=places&callback=initMap&libraries=places&v=weekly";
document.body.appendChild(googleMapsScript);

const test = 123
