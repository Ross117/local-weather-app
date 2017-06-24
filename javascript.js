$(window).on("load", () => {
  "use strict";

// check if user has granted permission to access their location
  if ("geolocation" in navigator) {
    // getLocation ();
  } else {
    handleErr ();
    $(".weatherContainer").html("You haven't given permission for your currrent location to be disclosed. That's fine, but without knowing your location, we can't show you what the weather's like in your local area.");
  }
});

function getLocation () {
  "use strict";

  const success = (pos) => {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
//  pass latitude and longitude values to a function which will use them to make an API call
    getLocalWeather(lat, long);
  };

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

// pass user's geolocation to weather API, handle errors
function getLocalWeather (lat, long) {
  "use strict";
// make call to API
  $.ajax({
// use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://api.darksky.net/forecast/c40dcc41bb316dec59a0eb46699d013d/" + lat + "," + long,
    success: (json) => {
      const weather = json.currently.summary;
      const temp = json.currently.temperature;
      const icon = json.currently.icon;
      $(".weather").html(weather);
      $(".temperature").html(temp + "°F");
//    call function to change the image
      changeImg(icon);
    },
    error: () => {
      handleErr ();
      $(".weatherContainer").html("Sorry, something went wrong with the API call");
    }
  });
}

// change img depending on API response
function changeImg (icon) {
  "use strict";
}

// add event to button which switches between Celcius & Farenheit
$(".tempSwitch").on("click", () => {
   "use strict";

   const tempEle = $(".temperature");

   if (tempEle.html() === "") return;

   const length = tempEle.html().length;
   const type = tempEle.html().slice(length - 2);
   const temp = tempEle.html().slice(0, length - 2);

   if (type === "°F") {
     const celcius = Math.round((((temp - 32) * 0.5556)) * 100);
     tempEle.html(celcius + "°C");
   } else if (type === "°C") {
     const farenheit = (temp * 1.8) + 32;
     tempEle.html(farenheit + "°F");
   }

});

// clear the html from the divs on the page
function handleErr () {
  "use strict";

  $("div").not(".container-fluid").html("");
}
