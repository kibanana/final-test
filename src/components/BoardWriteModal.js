import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { boardCreate } from '../lib/axios';

class BoardWriteModal extends Component {
  state = {
    title: null,
    body: null,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { title, body } = this.state;
      await boardCreate({ title, body });
      this.props.onSubmit();
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "글 작성을 할 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 글을 작성할 수 없습니다",
          });
        }
        else {
          alert('Unknown Error');
          console.log(err);
        }
      }
      else {
        alert("Unknown Error");
        console.log(err);
      }
    }
  }

  render() {
    const { title, body } = this.state;
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => this.props.onHide()}>
          <Modal.Title id="contained-modal-title-vcenter">
            새 글 작성하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>제목</Form.Label>
          <Form.Control name="title" onChange={this.handleChange} />
          <br />
          <Form.Label>내용</Form.Label>
          <Form.Control as="textarea" name="body" rows="5" onChange={this.handleChange} />
          <br />
          <Button type="submit" variant="primary" onClick={this.handleSubmit} disabled={!title || !body}>
            저장
          </Button>

          <div className="message">
            <span>{this.state.message}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.onHide()}>창 닫기</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default BoardWriteModal;
