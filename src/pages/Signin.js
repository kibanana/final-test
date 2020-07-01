import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Col, Row, Button } from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
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
      const { _id: userId } = jwtDecode(res.data.data.token);
      this.props.UserBinding({ userId });
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
      <div className="content">
        <Form className="sign">
          <legend>로그인</legend>
          <Row>
            <Col xs={5}>
              <Form.Group>
                <Form.Label>이메일</Form.Label>
                  <Form.Control type="text" name="email" placeholder="이메일을 입력해주세요" onChange={this.handleChange} />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={5}>
              <Form.Group>
                <Form.Label>비밀번호</Form.Label>
                  <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요" onChange={this.handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <div className="message">
            <span>{this.state.message}</span>
          </div>

          <Button type="submit" onClick={this.handleSubmit} disabled={!email || !password} varient="primary">로그인</Button>
        </Form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  UserBinding: value => dispatch(UserBinding(value)),
});

export default connect(null, mapDispatchToProps)(Signin);
