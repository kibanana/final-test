import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserBinding } from '../actions';
import jwtDecode from 'jwt-decode';
import cookies from '../lib/cookies';

class Interface extends Component {
  async componentDidMount() {
    const token = cookies.get('token');
    if (token) {
      const { _id: userId } = jwtDecode(token);
      const currentUser = { userId };
      this.props.UserBinding(currentUser);
    }
  }
  
  render() {
    return null;
  }
}

const mapDispatchToProps = (dispatch) => ({
  UserBinding: currentUser => dispatch(UserBinding(currentUser)),
});

export default connect(null, mapDispatchToProps)(Interface);
