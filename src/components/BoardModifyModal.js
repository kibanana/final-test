import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { boardUpdate } from '../lib/axios';

class BoardModifyModal extends Component {
  state = {
    title: this.props.title,
    body: this.props.body,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { boardid } = this.props;
      const { title, body } = this.state;
      await boardUpdate(boardid, { title, body });
      this.props.onSubmit(title, body);
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "글을 수정할 수 없습니다",
          });
        }
        else if (res.status === 404) {
          this.setState({
            message: "글이 정상적으로 수정되지 않았습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 글을 수정할 수 없습니다",
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
    const { title, body } = this.props;
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => this.props.onHide()}>
          <Modal.Title id="contained-modal-title-vcenter">
            글 수정하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>제목</Form.Label>
          <Form.Control name="title" onChange={this.handleChange} defaultValue={title} />
          <br />
          <Form.Label>내용</Form.Label>
          <Form.Control as="textarea" name="body" rows="5" onChange={this.handleChange} defaultValue={body} />
          <br />
          <Button type="submit" variant="primary" onClick={this.handleSubmit} disabled={!title || !body}>
            수정
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

export default BoardModifyModal;
