import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import nav from './nav';

// pages의 path를 to로 가져와야 한다.

//// pages 가져오지 않고 따로 분리

class Header extends Component {
  render() {
    const activeLinkStyle = {
      color: '#ffad60',
      fontSize: '2rem',
    }

    /////////
    let navs = null;
    if (this.props.currentUser) { // token 있으면 -> signout
      navs = nav.filter(elem => elem.invisibleBeforeAuth === true || elem.invisibleBeforeAuth === undefined);
    }
    else { // token 없으면 -> signup, signin
      navs = nav.filter(elem => elem.invisibleBeforeAuth === false || elem.invisibleBeforeAuth === undefined);
    }
    return (
      <div className="header">
        <ul>
          { navs.map((elem, idx) => {
              return (
                <li key={idx}>
                  <NavLink to={elem.path} activeStyle={activeLinkStyle}>{elem.name}</NavLink>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.userStore.currentUser,
});

export default connect(mapStateToProps, null)(Header);
