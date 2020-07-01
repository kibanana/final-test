import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Interface from './Interface';
import pages from './pages';

class Pages extends Component {
  render() {
    return (
      <Fragment>
        <Interface />
        <Switch>
          { pages.map((elem, idx) => <Route key={idx} { ...elem } />) }
        </Switch>
      </Fragment>
    );
  }
}

export default Pages;
