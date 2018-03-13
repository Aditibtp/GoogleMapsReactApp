var React  = require('react');
var ReactDom = require('react-dom');

class WeatherPopup extends React.Component{

  constructor(props){
    super(props)
  }

  render() {
    let weatherProps = this.props.weatherInfo;
    let locationDetails = this.props.locationDetails;
    return (
      <div className="weather-popup">
        <div className="weather-intro">
          <div className="weather-icon"><img src="/images/weather-icons/01d.svg" className="weather-icon-svg"/></div>
          <div className="weather-summary">
            <p>{locationDetails}</p>
            <p className="weather-sum">{weatherProps.weathDesc}</p>
          </div>
        </div>
        <div className="weather-details">   
          <p>
            <span className="min-temp-text">Min Temp:</span>
            <span className="min-temp-value">{weatherProps.minTemp}</span>
          </p>
          <p>
            <span className="max-temp-text">Max Temp:</span>
            <span className="max-temp-value">{weatherProps.maxTemp}</span>
          </p>
        </div>
    </div>
    )
  }
}

module.exports = WeatherPopup;