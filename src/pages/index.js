import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import pages from './pages';
import Header from './Header';

class Pages extends Component {
  render() {
    return (
      <Fragment>
        <div className="App-header">
          <Header />
        </div>
        <Switch>
          { pages.map((elem, idx) => <Route key={idx} { ...elem } />) }
        </Switch>
      </Fragment>
    );
  }
}

export default Pages;
