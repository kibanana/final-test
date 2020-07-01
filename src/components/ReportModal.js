import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class ReportModal extends Component {
  state = {
    code: 1,
    value: null,
    valueForm: {},
    valueFormShow: false,
  };

  handleCodeChange = (e) => {
    const code = Number(e.target.value);
    this.setState({
      code,
      value: null,
      valueForm: {...this.state.valueForm, ...{value: ''}},
    });
    if (code === 4) {
      this.setState({
        valueFormShow: true,
      });
    }
    else {
      this.setState({
        valueFormShow: false,
      });
    }
  }

  handleValueChange = (e) => {
    this.setState({
      value: e.target.value,
      valueForm: e.target,
    });
  }

  render() {
    const { code, value } = this.state;
    const displayNone = (code !== 4) ? true : false;
    const { onSubmit, ...other } = this.props;
    return (
      <Modal
        {...other}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => this.props.onHide()}>
          <Modal.Title id="contained-modal-title-vcenter">
            신고하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>신고 사유</Form.Label>
          <Form.Control as="select" onChange={this.handleCodeChange} defaultValue={code}>
            <option value="1">부적절한 홍보 게시</option>
            <option value="2">음란성 또는 청소년에게 부적합한 내용</option>
            <option value="3">명예훼손/사생활 침해 및 저작권 침해</option>
            <option value="4">기타</option>
          </Form.Control>
          <br />
          <div style={{ display: displayNone ? "none" : "block" }}>
            <Form.Label>기타 사유</Form.Label>
            <Form.Control as="textarea" name="body" rows="5" onChange={this.handleValueChange} />
          </div>
          <br />
          { /* 코드가 1, 2, 3 중 하나거나 코드가 4인데 value도 잘 쓴 경우 -> submit 가능  */}
          <Button type="submit" variant="primary" onClick={() => onSubmit(code === 4 ? value : code)} disabled={(!([1, 2, 3].includes(code))) && (!(code === 4 && value))}>
            신고 완료
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.onHide()}>창 닫기</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ReportModal;
