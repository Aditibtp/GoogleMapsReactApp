var React  = require('react');
var ReactDom = require('react-dom');
var api = require('../../utils/api.js');
var HeaderForm = require('./HeaderForm');

class Header extends React.Component{

  constructor(props){
    super(props);
    
  }

  render() {
    let weatherProps = this.props.weatherInfo;
    let locationDetails = this.props.locationDetails;
    return (
        <div className="main-header">
            <div className="text-header"><span>Weather Reporter</span></div>
            <div className="form-element-div">
                <HeaderForm/>
            </div>
        </div>
    )
  }
}

module.exports = Header;