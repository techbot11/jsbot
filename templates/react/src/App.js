import React, { Component } from 'react';
import { withRouter, BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import routes from './routes';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {
            routes.map(route => <Route component={withRouter(route.component)} path={route.path} exact={route.exact} />)
          }
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
