import React, { Component } from 'react';
import logo from '../../Assets/logo.png';

class Loader extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            LOADIND..
          </p>
        </header>
      </div>
    )
  }
}

export default Loader;