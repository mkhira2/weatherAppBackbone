//--------------------------------------------------
//GLOBAL VARIABLES
//--------------------------------------------------
var weatherUrl = 'https://api.darksky.net/forecast/2ab8ce24aa16ccb7cde7c733c702e6e1'
var googleURL = 'http://maps.googleapis.com/maps/api/geocode/json?address='
var containerNode = document.querySelector('.weatherContainer')
var currentNode = document.querySelector('.current')
var dailyNode = document.querySelector('.daily')
var hourlyNode = document.querySelector('.hourly')
var searchInput = document.querySelector(".search")
var searchResults = document.querySelector(".searchResults")

//--------------------------------------------------
// MOTHERSHIP FUNCTIONS
//--------------------------------------------------

function controller(currentObj) { // where everything starts
       var hashStr = location.hash.substr(1), // make location.hash an array, beginning after #
           hashParts = hashStr.split('/') // separate array by /
           latitude = hashParts[0] // isolate latitude
           longitude = hashParts[1] // isolate longitude
           viewType = hashParts[2] // isolate current/daily/hourly
       var promise = $.getJSON(weatherUrl + '/' + latitude + ',' + longitude + '?callback=?')
       if (viewType === 'current') {
           promise.then(handleCurrent)  
       }
       else if (viewType === 'hourly') {
           promise.then(handleHourly)
       }
       else if (viewType === 'daily') {
            promise.then(handleDaily)
           
       }
       else {
           navigator.geolocation.getCurrentPosition(handleCoords)
       }
}

function handleCoords(coordsObj) { // gets coords on page load (from 'else' in controller)
       var lat = coordsObj.coords.latitude
       var lng = coordsObj.coords.longitude
       var hashString = lat + '/' + lng + '/current'
       location.hash = hashString
}

function hideGif() { // hides gif on page load
    var loadingGif = document.querySelector('.loadingGif')
    loadingGif.style.display = 'none'
}

//--------------------------------------------------
//FUNCTIONS THAT WRITE TO EACH PAGE
//--------------------------------------------------

function handleCurrent(currentWeather) { // writes to current page
  containerNode.innerHTML = '<h2>' + '<i class="fa fa-sun-o" aria-hidden="true"></i>' 
                           + " Current Weather " 
                           + '<i class="fa fa-moon-o" aria-hidden="true"></i>' + '<hr></h2>'
                           + '<div class="box">' + '<h3>' + currentWeather.currently.summary + '</h3>'
                           // + '<li>' + currentWeather.currently.icon + '</li>'
                           + '<li> Temperature: ' + Math.round(currentWeather.currently.temperature) + ' degrees</li>'
                           + '<li> Chance of Rain: ' + Math.round(currentWeather.currently.precipProbability) + '%</li>'
                           + '<li> Wind Speed: ' + Math.round(currentWeather.currently.windSpeed) + ' mph</li>'
                           + '<li> Humidity: ' + Math.round((currentWeather.currently.humidity * 100)) + '%</li></div>'
                           hideGif()
}

function handleHourly(hourlyWeather) { // writes to hourly page
   containerNode.innerHTML = '<h2>' + '<i class="fa fa-sun-o" aria-hidden="true"></i>' 
                                    + " 12 Hour Forecast " 
                                    + '<i class="fa fa-clock-o" aria-hidden="true"></i>' + '<hr></h2>'
   for (var i = 0; i < 12; i++) {
       var currentHour = hourlyWeather.hourly.data[i]
       var hourlyTime = moment.unix(currentHour.time).format('h' + ':00' + 'a')
       containerNode.innerHTML += '<div class="box">' 
                               + '<p><h3 class="time">' + hourlyTime + ': ' + '</h3></p>'
                               + '<li>' + currentHour.summary + '</li>'
                               + '<li>' + 'Temp: ' + Math.round(currentHour.temperature) + ' degrees</li>'
                               + '<li>' + 'Chance of Rain: ' + Math.round(currentHour.precipProbability) + '%</li>'
                               + '<li> Wind Speed: ' + Math.round(currentHour.windSpeed) + ' mph</li>'
                               + '<li> Humidity: ' + Math.round((currentHour.humidity * 100)) + '%</li></div>'
                               + '</ br></ br>'
                               hideGif()
   }
}

function handleDaily(dailyWeather) { // writes to daily page
   containerNode.innerHTML = '<h2>' + '<i class="fa fa-sun-o" aria-hidden="true"></i>' 
                                    + " 7 Day Outlook " 
                                    + '<i class="fa fa-calendar" aria-hidden="true"></i>' + '<hr></h2>'
   for (var i = 0; i < 7; i++) {
       var currentDay = dailyWeather.daily.data[i]
       var day = moment.unix(currentDay.time).format('dddd')
       containerNode.innerHTML += '<div class="box">' 
                               + '<p><h3 class="time">' + day + ': ' + '</h3></p>' 
                               + '<li>' + currentDay.summary + '</li>' 
                               + '<li>' + 'Temp Min: ' + Math.round(currentDay.temperatureMin) + ' degrees</li>'
                               + '<li>' + 'Temp Max: ' + Math.round(currentDay.temperatureMax) + ' degrees</li>'
                               + '<li>' + 'Chance of Rain: ' + Math.round(currentDay.precipProbability) + '%</li>'
                               + '<li> Wind Speed: ' + Math.round(currentDay.windSpeed) + ' mph</li>'
                               + '<li> Humidity: ' + Math.round((currentDay.humidity * 100)) + '%</li></div>'
                               + '</ br></ br>'
                               hideGif()
   }
}
//--------------------------------------------------
//HASH ROUTING CHANGE ON BUTTON CLICK
//--------------------------------------------------

currentNode.addEventListener('click', function() { // hash change when current clicked
    var hashStr = location.hash.substr(1),
           hashParts = hashStr.split('/')
           latitude = hashParts[0]
           longitude = hashParts[1]
           viewType = hashParts[2]
           location.hash = latitude + '/' + longitude + '/' + 'current'
})

hourlyNode.addEventListener('click', function() { // hash change when hourly clicked 
    var hashStr = location.hash.substr(1),
           hashParts = hashStr.split('/')
           latitude = hashParts[0]
           longitude = hashParts[1]
           viewType = hashParts[2]
           location.hash = latitude + '/' + longitude + '/' + 'hourly'
})

dailyNode.addEventListener('click', function() { // hash change when daily clicked
    var hashStr = location.hash.substr(1),
           hashParts = hashStr.split('/')
           latitude = hashParts[0]
           longitude = hashParts[1]
           viewType = hashParts[2]
           location.hash = latitude + '/' + longitude + '/' + 'daily'
})

//--------------------------------------------------
//SEARCH FUNCTION
//--------------------------------------------------

searchInput.addEventListener('keydown', function(eventObj) { // search for a remote city
    if (eventObj.keyCode === 13) {
        var inputValue = eventObj.target.value
        var cityPromise = $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + inputValue)
        cityPromise.then(handleCityCoords)
        eventObj.target.value = ''
        searchResults.innerHTML = '<i class="fa fa-map-marker" aria-hidden="true"></i> ' + inputValue
    }
})

function handleCityCoords(apiResponse) { // get coords of searched city
    var newLat = apiResponse.results[0].geometry.location.lat
    var newLng = apiResponse.results[0].geometry.location.lng
    location.hash = newLat + '/' + newLng + '/current'
}

//--------------------------------------------------
//LET'S GET THIS PARTY STARTED
//--------------------------------------------------

window.addEventListener('hashchange', controller)
controller()
