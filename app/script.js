var React  = require('react');
var ReactDom = require('react-dom');

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


var WeatherPopup = require('./components/WeatherPopup');
// var HeaderForm = require('./components/HeaderForm');
// var api = require('../utils/api.js');

import apiKeys from "../config/apikeys.json"

window.getUserLocation = function(){
    navigator.geolocation.getCurrentPosition(function(position) {
        initMap(position.coords.latitude, position.coords.longitude);
    });
}

document.querySelector(".form-btn").addEventListener("click", function(){
    var address = inputEle.value;
    getLatLongFromAddress(address);
});

function initMap(posLat, posLong) {
    posLat = posLat;
    posLong = posLong;
    uluru = {lat: posLat, lng: posLong};
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: posLat, lng: posLong},
        zoom: 7
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
};
function getLatLongFromAddress(address){
    //var address = "Chennai, Tamil Nadu";
    // var geoAddtoLatLong = new Promise(function(resolve, reject){
    //     geocoder.geocode({'address': address}, function(results, status) {
    //         if (status === 'OK') {
    //             if (results[0]) {
    //                 console.log(results[0].geometry.location)
    //                 resolve(results)
    //             } else {
    //                 reject("No results found")
    //                 //window.alert('No results found');
    //             }
    //         } else {
    //             reject('Geocoder failed due to: ' + status);
    //             //window.alert('Geocoder failed due to: ' + status);
    //         }
    //     });
    // });
    //return geoAddtoLatLong;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                var lat = marker.getPosition().lat();
                var lng = marker.getPosition().lng();
                var center = new google.maps.LatLng(lat, lng);
                // using global variable:
                //setTimeout used to avoid * geocoder failing due to over_query_limit * error
                window.setTimeout(function(){
                    map.panTo(center);
                    addWeatherPopupForMarker(marker, {lat, lng});
                }, 2000)
                //resolve(results)
            } else {
                //reject("No results found")
                window.alert('No results found');
            }
        } else {
            //reject('Geocoder failed due to: ' + status);
            window.alert('Geocoder failed due to: ' + status);
        }
    });
};

//gets location city from lat long
function geocodeLatLng(latlng) {
    // var latlng = uluru;
    var geoLocPromise = new Promise(function(resolve, reject){
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(results);
                    updateInputValue(results[0]);
                    resolve(results);
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

function addWeatherPopupForMarker(marker, latlng){
    //get x and y of current lat-long marker
    var locationPro  = geocodeLatLng(latlng);
    var weatherPro = getWeatherData(latlng);
    //getLatLongFromAddress("Bengaluru, Karnataka");
    var location;
    var weatherInfo;
    Promise.all([locationPro, weatherPro]).then((data)=>{
        weatherInfo = data[1];
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
            <WeatherPopup weatherInfo = {weatherProps} locationDetails = {locationDetails} mapMarker = {marker} projection={proj}/>, popUpCont
        )
    });    
}

//updates marker position and creates pop up for new marker position
function addMapClickListener(){
    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
};

// function addHeaderFormElement(){
//     var headerFormCont = document.querySelector(".form-element-div");
//     ReactDom.render(
//         <HeaderForm/>, headerFormCont
//     )
// }

function attachGoogleMapsApi(){
    //addHeaderFormElement();
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

attachGoogleMapsApi();