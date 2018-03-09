var React  = require('react');
var ReactDom = require('react-dom');

class WeatherPopup extends React.Component{

  constructor(props){
    super(props)
  }

  render() {
    console.log(this.props)
    return (
      <div className="weather-popup">
        <div className="weather-intro">
          <div className="weather-icon"><img src="/images/weather-icons/01d.svg" className="weather-icon-svg"/></div>
          <div className="weather-summary">
            <p>Bengaluru, Karnataka</p>
            <p className="weather-sum">{this.props.weathDesc}</p>
          </div>
        </div>
        <div className="weather-details">   
          <p>
            <span className="min-temp-text">Min Temp:</span>
            <span className="min-temp-value">{this.props.minTemp}</span>
          </p>
          <p>
            <span className="max-temp-text">Max Temp:</span>
            <span className="max-temp-value">{this.props.maxTemp}</span>
          </p>
        </div>
    </div>
    )
  }
}

module.exports = WeatherPopup;