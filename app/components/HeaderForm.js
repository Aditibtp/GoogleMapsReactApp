var React  = require('react');
var ReactDom = require('react-dom');
var api = require('../../utils/api.js');

class HeaderForm extends React.Component{

  constructor(props){
    super(props);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    var place = this.refs.place.value;
    var address = place;
    api.getLatLongFromAddress(address);
  }

  render() {
    let weatherProps = this.props.weatherInfo;
    let locationDetails = this.props.locationDetails;
    return (
        <div className="header-form">
            <form onSubmit= {this.handleFormSubmit}>
                <input type="text" placeholder="current country" ref="place"></input>
                <button className="form-btn">Go</button>
            </form>
        </div>
    )
  }
}

module.exports = HeaderForm;