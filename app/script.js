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

    //initialising maps overlay
    mapsOverlay = new google.maps.OverlayView();
    mapsOverlay.draw = function() {};
    mapsOverlay.setMap(map);

    //initialising geocoder to get readabel location from lat long
    geocoder = new google.maps.Geocoder;
    infowindow = new google.maps.InfoWindow;

    //intialising maker to get marker position on viewport using projection
    marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

    //hideLoader();

    addMapClickListener();
    addInitMapListener(uluru);
};

function addInitMapListener(latlng){
    map.addListener("idle", function(){
        var loadingEle = document.querySelector(".loader");
        loadingEle.style.display = "none";
        var mapEle = document.querySelector("#mapCont");
        mapCont.style.display = "block";
        addWeatherPopupForMarker(marker, latlng);
    });
}

//gets location city from lat long
function geocodeLatLng(latlng) {
    // var latlng = uluru;
    var location;
    var geoLocPromise = new Promise(function(resolve, reject){
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(results)
                    updateInputValue(results[1]);
                    resolve(results)
                } else {
                    reject("No results found")
                    //window.alert('No results found');
                }
            } else {
                reject('Geocoder failed due to: ' + status);
                //window.alert('Geocoder failed due to: ' + status);
            }
        });
    });
    return geoLocPromise;
};

function getWeatherData(latlng){
    var weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&APPID=${apiKeys.weather_api}&cnt=5&units=metric`
    // Default options are marked with *
    return fetch(weatherApiUrl, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        method: 'GET', // *GET, PUT, DELETE, etc.
        redirect: 'follow', // *manual, error
    }).then(response => response.json()) // parses response to JSON
}

function hideLoader(){
    var location = geocodeLatLng();

    getWeatherData(uluru)
    .then(data => updateWeatherPopUp(data)) // JSON from `response.json()` call
    .catch(error => console.error(error))

    console.log("from hide loader");
    console.log(location);
    
    map.addListener("idle", function(){
        var loadingEle = document.querySelector(".loader");
        loadingEle.style.display = "none";
        var mapEle = document.querySelector("#mapCont");
        mapCont.style.display = "block";
        addWeatherPopupForMarker(marker, location);
    });
};

function addWeatherPopupForMarker(marker, latlng){
    //get x and y of current lat-long marker
    var locationPro  = geocodeLatLng(latlng);
    var weatherPro = getWeatherData(latlng);

    var location;
    var weatherInfo;

    Promise.all([locationPro, weatherPro]).then((data)=>{
        console.log(data[0]);
        weatherInfo = data[1];
        console.log(data[1]);
        location = data[0][1];
        var popUpCont = document.querySelector("#weather-cont");
        var proj = mapsOverlay.getProjection();
    
        var addressComp = location.address_components;
        var locationDetails = `${addressComp[1].long_name}, ${addressComp[3].long_name}`
        var weatherProps = {
            weathDesc: weatherInfo.weather[0].description,
            maxTemp: weatherInfo.main.temp_max,
            minTemp: weatherInfo.main.temp_min
        }
        ReactDom.render(
            <WeatherPopup weatherInfo = {weatherProps} locationDetails = {locationDetails}/>, popUpCont
        )
        if(proj){
            var pos = marker.getPosition();
            var p = proj.fromLatLngToContainerPixel(pos);
            var weatherPopUp = document.querySelector(".weather-popup");
            weatherPopUp.style.left = (p.x - 110) + "px";
            weatherPopUp.style.top = (p.y - 10) + "px";
            weatherPopUp.style.visibility = "visible";
        }
    });    
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
    // scriptEle.defer = true;
    // scriptEle.async = true;
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
     addWeatherPopupForMarker(marker, pos);
 };

 function updateInputValue(resultArray){
     var addressComp = resultArray.address_components;
    inputEle.value = `${addressComp[1].long_name}, ${addressComp[3].long_name}`
 }

 function updateWeatherPopUp(data){
    weatherInfo = data;
 };


attachGoogleMapsApi();