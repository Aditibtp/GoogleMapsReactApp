var React  = require('react');
var ReactDom = require('react-dom');
import apiKeys from "../config/apikeys.json"
var WeatherPopup = require('../components/WeatherPopup');

var map;
var posLat;
var posLong;
var geocoder;
var infowindow;
var uluru;
var mapsOverlay;
var marker;
var inputEle = document.querySelector("input");
var weatherInfo = {};

window.getUserLocation = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
        initMap(position.coords.latitude, position.coords.longitude);
    });
}

function initMap(posLat, posLong) {
    posLat = posLat;
    posLong = posLong;
    uluru = {lat: posLat, lng: posLong};
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: posLat, lng: posLong},
        zoom: 8
    });
    hideLoader();
    addMapClickListener();
    geocoder = new google.maps.Geocoder;
    infowindow = new google.maps.InfoWindow;
    marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
    geocodeLatLng(geocoder, map, infowindow, uluru);
}

function geocodeLatLng(geocoder, map, infowindow) {
    // var input = document.getElementById('latlng').value;
    // var latlngStr = input.split(',', 2);
    var latlng = uluru;
    geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
        if (results[0]) {
            updateInputValue(results[5]);
        } else {
            window.alert('No results found');
        }
    } else {
        window.alert('Geocoder failed due to: ' + status);
    }
    });
    getWeatherData(uluru)
    .then(data => updateWeatherPopUp(data)) // JSON from `response.json()` call
    .catch(error => console.error(error))
};

function getWeatherData(uluru){
    var weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${uluru.lat}&lon=${uluru.lng}&APPID=${apiKeys.weather_api}&cnt=5&units=metric`
    // Default options are marked with *
    return fetch(weatherApiUrl, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        method: 'GET', // *GET, PUT, DELETE, etc.
        redirect: 'follow', // *manual, error
    })
    .then(response => response.json()) // parses response to JSON
}

function hideLoader(){
    map.addListener("idle", function(){
        var loadingEle = document.querySelector(".loader");
        loadingEle.style.display = "none";
        var mapEle = document.querySelector("#mapCont");
        mapCont.style.display = "block";
        addWeatherPopupForMarker(marker);
    });
};

function addWeatherPopupForMarker(marker){
    //get x and y of current lat-long marker
    console.log(weatherInfo)
    mapsOverlay = new google.maps.OverlayView();
    mapsOverlay.draw = function() {};
    mapsOverlay.setMap(map);
    var popUpCont = document.querySelector("#weather-cont");
    var proj = mapsOverlay.getProjection();
    ReactDom.render(
        <WeatherPopup weathDesc={weatherInfo.weather[0].description} minTemp={weatherInfo.main.temp_max} maxTemp={weatherInfo.main.temp_min}/>, popUpCont
    )
    if(proj){
        var pos = marker.getPosition();
        var p = proj.fromLatLngToContainerPixel(pos);
        var weatherPopUp = document.querySelector(".weather-popup");
        weatherPopUp.style.left = (p.x - 110) + "px";
        weatherPopUp.style.top = (p.y - 10) + "px";
        weatherPopUp.style.visibility = "visible";
    }
}

//updates marker position and creates pop up for new marker position
function addMapClickListener(){
    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
};

function attachGoogleMapsApi(){
    var scriptEle = document.createElement("script");
    scriptEle.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeys.google_maps}&callback=getUserLocation&libraries=drawing,places`;
    scriptEle.defer = true;
    scriptEle.async = true;
    var bodyElement = document.querySelector("body");
    bodyElement.appendChild(scriptEle);
};
 
 function placeMarker(location) {
     var marker = new google.maps.Marker({
         position: location, 
         map: map
     });
     var lat = marker.getPosition().lat();
     var lng = marker.getPosition().lng();
     var pos = {lat, lng};
     getWeatherData(pos)
     .then(data => updateWeatherPopUp(data)) // JSON from `response.json()` call
     .catch(error => console.error(error));
 };

 function updateInputValue(resultArray){
     var addressComp = resultArray.address_components;
    inputEle.value = `${addressComp[1].long_name}, ${addressComp[3].long_name}`
 }

 function updateWeatherPopUp(data){
    weatherInfo = data;
    addWeatherPopupForMarker(marker);
 };


attachGoogleMapsApi();