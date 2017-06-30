$(".getWeatherInfo").on("click", () => {
  "use strict";

// check if user has granted permission to access their location
  if (navigator.geolocation) {
    getLocation ();
  } else {
    handleErr ();
    $(".weatherContainer").html("You haven't given permission for your currrent location to be disclosed. That's fine, but without knowing your location, we can't show you what the weather's like in your local area.");
  }
});

function getLocation () {
  "use strict";

  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
//  get current time
    $(".currentTime").html(new Date().toLocaleString('en-GB'));
//  get the name of the user's location
    getLocationName(lat, lng);
//  pass latitude and longitude values to a function which will use them to make an API call
    getLocalWeather(lat, lng);
  };

//  handle error
  const error = () => {
    handleErr ();
    $(".weatherContainer").html("Sorry, something went wrong when we tried to access your current location.");
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

// attempt to get the user's current location
  navigator.geolocation.getCurrentPosition(success, error, options);
}

//  use Google geocoding API to get the user's location name
function getLocationName (lat, lng) {
  "use strict";

  const geocoder = new google.maps.Geocoder;
  const latlng = {lat: lat, lng: lng};
  const $userLocation = $(".userLocation");

  // make request to Google Maps Geocoding API to get the user's current location address
  geocoder.geocode({'location': latlng}, (results, status) => {
    if (status === 'OK') {
      if (results[1]) {
        $userLocation.html(results[1].formatted_address);
      } else {
        $userLocation.html("Sorry, we couldn't find the address of your current location.");
      }
    } else {
       $userLocation.html("Sorry, something went wrong when we tried to find the address of your current location");
    }
  });
}

// pass user's geolocation to weather API, handle errors
function getLocalWeather (lat, lng) {
  "use strict";
// make call to API
  $.ajax({
// use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://api.darksky.net/forecast/c40dcc41bb316dec59a0eb46699d013d/" + lat + "," + lng,
    success: (json) => {
      const weather = json.currently.summary;
      const temp = json.currently.temperature;
      const icon = json.currently.icon;

      $(".intro").html("This is what the weather's like where you are:");
      $(".weather").html(weather);
      $(".temperature").html(temp + "°F");

//    add weather icon using Skycons provided by Dark Sky
      addSkycon(icon);
    },
//  handle error
    error: () => {
      handleErr ();
      $(".weatherContainer").html("Sorry, something went wrong with the API call");
    }
  });
}

// change img depending on API response
// need to take into account that a skycon may already have been loaded by user, in that case
// need to change an existing icon, not just add a new one
function addSkycon (icon) {
  "use strict";

  const skycons = new Skycons({
    "color": "black",
//  android hack
    "resizeClear": true
  });

  skycons.add(document.getElementById("weatherIcon"), icon);

  skycons.play();
}

// clear the html from the divs on the page
function handleErr () {
  "use strict";

  $("div").not(".container-fluid").html("");
}

// add event to button which switches between Celcius & Farenheit
$(".tempSwitch").on("click", () => {
   "use strict";

   const tempEle = $(".temperature");

   if (tempEle.html() === "") return;

   const length = tempEle.html().length;
   const type = tempEle.html().slice(length - 2);
   const temp = tempEle.html().slice(0, length - 2);
   const $tempSwitchBtn = $(".tempSwitch");

   if (type === "°F") {
     const celcius = (temp - 32) * 5/9;
     tempEle.html(celcius.toFixed(2) + "°C");
     $tempSwitchBtn.html("Switch to Farenheit");

   } else if (type === "°C") {
     const farenheit = (temp * 9/5) + 32;
     tempEle.html(farenheit.toFixed(2) + "°F");
     $tempSwitchBtn.html("Switch to Celcius");
   }

});
