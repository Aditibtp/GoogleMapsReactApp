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
                    updateInputValue(results[0]);
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

module.exports = {
    getWeatherData: getWeatherData,
    geocodeLatLng: geocodeLatLng,
    getLatLongFromAddress: getLatLongFromAddress

};

//set position left/top for weatherPopup in weatherPopup component
//use api.js to get weather and other google maps related data
//create HeaderForm component and connect to api.js
//clean up the placing marker code on map
//create svg icon for webapp
//create second page showing weather history on clicking weather pop up -- understand usage of router and Link
//fix usage of weather svg based on weather shown on weather pop up
