import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookies from '../lib/cookies';
import { signIn } from '../lib/axios';
import { UserBinding } from '../actions';
import './Form.css';

//// 로그인, 로그아웃 상태구분 고민해보기 ()

class Signin extends Component {
  state = {
    email: null,
    password: null,
    message: null,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      ////////
      const { email, password } = this.state;
      const res = await signIn({ email, password });
      cookies.set('token', res.data.data.token);
      this.props.UserBinding({});
      this.props.history.push('/');
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "이메일이나 비밀번호가 틀렸습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 로그인에 실패했습니다",
          });
        }
        else {
          alert("Unknown Error");
        }
      }
      else {
        alert("Unknown Error");
        console.log(err);
      }
    }
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="sign">
        <legend>로그인</legend>
        <div>
          <label>
            이메일
            <input type="text" name="email" placeholder="이메일을 입력해주세요" onChange={this.handleChange} />
          </label>
          <label>
            비밀번호
            <input type="password" name="password" placeholder="비밀번호를 입력해주세요" onChange={this.handleChange} />
          </label>

          <div className="message">
            <span>{this.state.message}</span>
          </div>

          <button type="submit"  onClick={this.handleSubmit} disabled={!email || !password}>로그인</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  UserBinding: value => dispatch(UserBinding(value)),
});

export default connect(null, mapDispatchToProps)(Signin);
