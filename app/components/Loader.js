var React  = require('react');
var ReactDom = require('react-dom');

class Loader extends React.Component{
      constructor(props){
        super(props);
      }

      render() {
        return (
            <div className="loader"></div>
        )
    }
}

module.exports = Loader;