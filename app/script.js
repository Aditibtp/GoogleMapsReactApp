var React  = require('react');
var ReactDom = require('react-dom');
var App = require("./components/App");
import apiKeys from "../config/apikeys.json"

var map;
var posLat;
var posLong;
var geocoder;
var infowindow;
var userLocation;
var mapsOverlay;
var marker;
var inputEle = document.querySelector("input");
var weatherInfo = {};

window.getUserLocation = function(){
    if(typeof window.localStorage.lat !== "undefined" && typeof window.localStorage.long !== "undefined"){

        initMap(parseInt(window.localStorage.getItem("lat"), 10), parseInt(window.localStorage.getItem("long"), 10));
    }else{
        navigator.geolocation.getCurrentPosition(function(position) {
            window.localStorage.setItem("lat", position.coords.latitude);
            window.localStorage.setItem("long", position.coords.longitude) ;

            initMap(position.coords.latitude, position.coords.longitude);
        });
    }
}

function initMap(posLat, posLong) {
    posLat = posLat;
    posLong = posLong;
    userLocation = {lat: posLat, lng: posLong};
    var mapOverlay = document.querySelector("#map-overlay");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: posLat, lng: posLong},
        zoom: 7
    });
    ReactDom.render(
        <App map = {map} userLocation = {userLocation}/>, mapOverlay
    )
    //addMapClickListener();
    //addInitMapListener(userLocation);
}

function attachGoogleMapsApi(){
    //addHeaderFormElement();
    var scriptEle = document.createElement("script");
    scriptEle.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeys.google_maps}&callback=getUserLocation&libraries=drawing,places`;
    // scriptEle.defer = true;
    // scriptEle.async = true;
    var bodyElement = document.querySelector("body");
    bodyElement.appendChild(scriptEle);
};

attachGoogleMapsApi();
 