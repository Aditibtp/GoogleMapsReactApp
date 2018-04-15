var React  = require('react');
var ReactDom = require('react-dom');
var api = require('../../utils/api.js');

var WeatherPopup = require('./WeatherPopup');

class MapView extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      clickPosition: {
        lat: this.props.userLocation.lat,
        lng: this.props.userLocation.lng
      },
      weatherInfo:  {
        weathDesc: '',
        maxTemp: '',
        minTemp: ''

      },
      locationDetails: '',
      mapMarker: null,
      projection: null
    }
  }

  componentWillMount (){
    console.log("inside map view");
    //initialising maps overlay
    this.mapsOverlay = new google.maps.OverlayView();
    this.mapsOverlay.draw = function() {};
    this.mapsOverlay.setMap(this.props.map);

    //initialising geocoder to get readabel location from lat long
    this.geocoder = new google.maps.Geocoder;

    //intialising maker to get marker position on viewport using projection
    this.marker = new google.maps.Marker({
        position: this.props.userLocation,
        map: this.props.map
    });
    this.addMapClickListener();
    this.setDataForWeatherPopup(this.props.userLocation);
  }
  
  placeMarker(location) {
        this.marker = new google.maps.Marker({
            position: location, 
            map: this.props.map
        });
        var lat = this.marker.getPosition().lat();
        var lng = this.marker.getPosition().lng();

        var pos = {lat, lng};
        console.log(pos);
        this.setDataForWeatherPopup(pos);
        this.setState(function(){
          return {
            clickPosition: {
              lat: lat,
              lng: lng
            },
            weatherInfo:  {
              weathDesc: '',
              maxTemp: '',
              minTemp: ''
      
            },
            locationDetails: '',
            mapMarker: null,
            projection: null
          }
        });
  };

  setDataForWeatherPopup(location){
    console.log("at load")
    //get x and y of current lat-long marker
    var locationPro  = api.geocodeLatLng(this.geocoder, location);
    var weatherProps = {};
    var locationDetails = '';
    var proj;
    var weatherPro = api.getWeatherData(location);
    this.mapsOverlay = new google.maps.OverlayView();
    this.mapsOverlay.draw = function() {};
    this.mapsOverlay.setMap(this.props.map);

    Promise.all([locationPro, weatherPro]).then((data)=>{
      var weatherInfo = data[1];
      var location = data[0][1];
      console.log(weatherInfo);
      proj = this.mapsOverlay.getProjection();

      var addressComp = location.address_components;
      locationDetails = `${addressComp[1].long_name}, ${addressComp[3].long_name}`
      weatherProps = {
          weathDesc: weatherInfo.weather[0].description,
          maxTemp: weatherInfo.main.temp_max,
          minTemp: weatherInfo.main.temp_min
      }
      this.setState(function(){
        return {
          weatherInfo:  weatherProps,
          locationDetails: locationDetails,
          mapMarker: this.marker,
          projection: proj
        }
      });
    });
  }

  addMapClickListener(){
    this.props.map.addListener('click', (event)=>{
        this.placeMarker(event.latLng);
    });
  };

  render() {
    console.log("rendering again");
    console.log(this.state);
    return (
      <WeatherPopup weatherInfo = {this.state.weatherInfo} locationDetails = {this.state.locationDetails} mapMarker = {this.state.mapMarker} projection={this.state.projection}/>
    )
  }
}

module.exports = MapView;