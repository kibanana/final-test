import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import './Form.css';
import { emailVerify, signUp } from '../lib/axios';

class Signup extends Component {
  state = {
    email: null,
    password: null,
    nickname: null,
    address: null,
    birthDay: null,
    message: null,
    emailChk: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleEmailCheck = async (e) => {
    try {
      await emailVerify(this.state.email);
      this.setState({
        emailChk: true,
      });
      alert('인증 메일이 발송되었습니다. 이메일 인증 후 회원가입 과정을 진행해주세요!');
    }
    catch (err) {
      ////////
      if (err && err.response) {
        const res = err.response;
        if (err.response.status === 400) {
          this.setState({
            message: res.data.description,
          });
        }
        else if (err.response.status === 500) {
          this.setState({
            message: res.data.description,
          });
        }

      }
      else {
        alert("Unknown Error");
        console.log(err);
      }
    }
  }
  
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password, nickname, address, birthDay } = this.state;
      await signUp({ email, password, nickname, address, birthDay });
      this.props.history.push('/');
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        let message = null;
        if (res.status === 400) {
          switch (res.data.err_code) {
            case 'ERR_EXIST_EMAIL':
              message = '중복된 이메일입니다. 이미 가입된 계정으로 로그인 해주세요!';
              break;
            case 'ERR_EXIST_NICKNAME':
              message = '다른 사용자의 닉네임입니다. 다른 닉네임을 입력해주세요!';
              break;
            case 'ERR_INVALID_EMAIL':
              message = '사용할 수 없는 이메일입니다. 이메일 인증을 완료해주세요!';
              break;
            case 'ERR_INVALID_PARAM':
              message = '정확한 정보를 입력해주세요!';
              break;
            default:
              alert("Unknown Error");
              break;
          }
          this.setState({
            message,
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 회원가입에 실패했습니다",
          });
        }
        else {
          alert("Unknown Error");

        }
      }
      else {
        alert("Unknown Error");
        console.log(err)
      }
    }
  }

  render() {
    const tempCurrentDate = new Date();
    tempCurrentDate.setDate(tempCurrentDate.getDate() + 3);
    const currentDate = tempCurrentDate.toISOString().substr(0,10);
    const { emailChk, email, password, nickname, address, birthDay } = this.state;
    return (
      <div className="content">
        <Form className="sign">
        <legend>회원가입</legend>
        <Row>
          <Col xs={5}>
            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control type="text" name="email" placeholder="이메일을 입력해주세요" onChange={this.handleChange} />
              <Button type="button" onClick={this.handleEmailCheck} variant="warning">이메일 인증</Button>
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
        <Row>
          <Col xs={5}>
            <Form.Group>
              <Form.Label>닉네임</Form.Label>
                <Form.Control type="text" name="nickname"  placeholder="닉네임을 입력해주세요" onChange={this.handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <Form.Group>
              <Form.Label>주소</Form.Label>
                <Form.Control type="text" name="address" placeholder="주소를 입력해주세요" onChange={this.handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <Form.Group>
              <Form.Label>생년월일</Form.Label>
                <Form.Control type="date" name="birthDay" max={currentDate} onChange={this.handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <div className="message">
          <span>{this.state.message}</span>
        </div>

        <Button type="button" disabled={!emailChk || !email || !password || !nickname || !address || !birthDay} onClick={this.handleSubmit} varient="primary">회원가입 완료</Button>
      </Form>
    </div>
    );
  }
}

export default Signup;
