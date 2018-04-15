var React  = require('react');
var ReactDom = require('react-dom');

var Header = require('./Header.js');
var MapView = require('./MapView.js');
var api = require('../../utils/api.js');

class App extends React.Component {
  render(){
    return (
      <div className="main-container">
          <MapView map = {this.props.map} userLocation = {this.props.userLocation}/>
      </div>
    )
  }
}

module.exports = App;