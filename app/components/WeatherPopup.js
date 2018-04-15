var React  = require('react');
var ReactDom = require('react-dom');

class WeatherPopup extends React.Component{

  constructor(props){
    super(props);
    this.styles = {
      left: 0,
      top: 0
    }
  }
    
  calculatePopUpPosition () {
    let props = this.props;
    if(props.projection){
      let pos = props.mapMarker.getPosition();
      let p = props.projection.fromLatLngToContainerPixel(pos);

      this.styles = {
        left: (p.x - 110) + "px",
        top: (p.y - 10) + "px",
        visibility: "visible"
      };
    }else{
      this.styles = {
        left: (110) + "px",
        top: (10) + "px",
        visibility: "hidden"
      };
    }
  }

  render() {
    console.log("inside weather pop up");
    console.log(this.props);
    
    let weatherProps = this.props.weatherInfo;
    console.log(typeof weatherProps)
    let locationDetails = this.props.locationDetails;

    this.calculatePopUpPosition();
    return (
      <div className="weather-popup" style = {this.styles}>
        <div className="weather-intro">
          <div className="weather-icon"><img src="/images/weather-icons/01d.svg" className="weather-icon-svg"/></div>
          <div className="weather-summary">
            {locationDetails !== '' && <p>{locationDetails}</p>}
            {typeof weatherProps !== "undefined" && weatherProps !== null && <p className="weather-sum">{weatherProps.weathDesc}</p>}
          </div>
        </div>
        <div className="weather-details">   
          <p>
            <span className="min-temp-text">Min Temp:</span>
            {typeof weatherProps !== "undefined" && weatherProps !== null && <span className="min-temp-value">{weatherProps.minTemp}</span>}
          </p>
          <p>
            <span className="max-temp-text">Max Temp:</span>
            {typeof weatherProps !== "undefined" && weatherProps !== null && <span className="max-temp-value">{weatherProps.maxTemp}</span>}
          </p>
        </div>
    </div>
    )
  }
}

module.exports = WeatherPopup;