// need to get user's geolocation, handle if permission not granted. window.onload event?
$(window).on("load", () => {
  "use strict";
  if ("geolocation" in navigator) {
    getLocation ();
  } else {
    $(".localWeather").html("You haven't given permission for your currrent location to be disclosed. That's fine, but without knowing your location, we can't show you what the weather's like in your local area");
  }
});

function getLocation () {
  "use strict";
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    getLocalWeather(lat, long);
  });
}

// pass user's geolocation to weather API, handle errors
function getLocalWeather (lat, long) {
  "use strict";
  // api key c40dcc41bb316dec59a0eb46699d013d
  $(".localWeather").html("Your current latitude is " + lat + " and your current longitude is " + long);
}


// change img depending on API response

// add event to button which switches between Celcius & Farenheit
