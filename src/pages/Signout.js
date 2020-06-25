import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookies from '../lib/cookies';
import { UserBinding } from '../actions';

class Signout extends Component {
  constructor(props) {
    super(props);
    cookies.remove('token');
    this.props.UserBinding(null);
    this.props.history.push('/');
  }
  render() {
    return null;
  }
};

const mapDispatchToProps = dispatch => ({
  UserBinding: value => dispatch(UserBinding(value)),
});

export default connect(null, mapDispatchToProps)(Signout);
