// boardid만 받아오면 BoardComment 컴포넌트에서 처리할 수 있음, comment는 BoardView에 UI 처리해줘야 함
import React, { Component, Fragment } from 'react';
import { InputGroup, Form, FormControl, ButtonGroup, Button, ListGroup, Modal } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import { boardCommentCreate, boardCommentUpdate, boardCommentDelete, boardCommentReport } from '../lib/axios';
import ReportModal from './ReportModal';
import getFormattedDateTimeString from '../lib/getFormattedDateTimeString';

class BoardComment extends Component {
  state = {
    commentId: null,
    commentValue: '',
    commentUpdateValue: '',
    commentUpdateModalShow: false,
    commentReportModalShow: false,
    message: null,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleCommentWriteSubmit = async (e) => {
    try {
      await boardCommentCreate(this.props.boardid, this.state.commentValue);
      this.setState({
        commentValue: '',
      });
      this.props.getBoard();
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "댓글을 달 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 댓글을 달 수 없습니다",
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

  handleCommentUpdateSubmit = async (e) => {
    try {
      await boardCommentUpdate(this.props.boardid, this.state.commentId, this.state.commentUpdateValue);
      this.setState({
        commentUpdateModalShow: false,
        commentUpdateValue: '',
      })
      this.props.getBoard();
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "댓글을 수정할 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 댓글을 수정할 수 없습니다",
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

  handleCommentDeleteClick = async (e) => {
    try {
      await boardCommentDelete(this.props.boardid, e.target.value);
      this.props.getBoard();
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "댓글을 삭제할 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 댓글을 삭제할 수 없습니다",
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

  handleCommentReportSubmit = async (code) => { // code는 기타인 경우 value다.
    try {
      let value;
      switch (code) {
        case 1:
          value = "부적절한 홍보 게시";
          break;
        case 2:
          value = "음란성 도는 청소년에게 부적합한 내용";
          break;
        case 3:
          value = "명예훼손/사생활 침해 및 저작권 침해 ";
          break;
        default:
          value = code;
          code = 4;
      }
      await boardCommentReport(this.props.boardid, this.state.commentId, { code, value });
      this.setState({
        commentReportModalShow: false,
      });
      this.props.getBoard();
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "댓글을 신고할 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 댓글을 신고할 수 없습니다",
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


  handleCommentUpdateButtonClick = (e) => {
    const { value } = this.props.comments
      .filter((elem) => elem._id === e.target.value)[0] || '';
    this.setState({
      commentUpdateModalShow: true,
      commentId: e.target.value,
      commentUpdateValue: value,
    });
  }

  handleCommentUpdateModalHide = (e) => {
    this.setState({
      commentUpdateModalShow: false,
      commentUpdateValue: '',
    });
  }


  handleCommentReportButtonClick = (e) => {
    this.setState({
      commentReportModalShow: true,
      commentId: e.target.value,
    });
  }

  handleCommentReportModalHide = (e) => {
    this.setState({
      commentReportModalShow: false,
    });
  }


  render() {
    const { comments, currentUserId } = this.props;
    const { commentValue, commentUpdateValue, message } = this.state;
    if (!comments && message) {
      return (
        <div className="message">
          <span>{message}</span>
        </div>
      );
    }
    else if (!comments) {
      return (
        <Loader 
          type="TailSpin"
          color="#00BFFF"
          height={70}
          width={70}
        />
      );
    }
    else {
      let CommentList = [];
      comments.sort((curr, next) => new Date(next.createdAt).getTime() - new Date(curr.createdAt).getTime());
      for (let i = 0; i < comments.length; i++) {
        const elem = comments[i];
        const commentReportUserIds = (elem.commentReportMembers || []).map(commentReportMember => commentReportMember.userId);
        const isCommentAuthor = currentUserId === elem.userId;
        const d = new Date(elem.createdAt);
        const formattedDateTimeString = getFormattedDateTimeString(d);

        if (commentReportUserIds.length < 2) {
          CommentList.push(
            <ListGroup.Item key={i}>
              <br />
              {elem.username || <span style={{color: 'red'}}>Unknown</span>} ({formattedDateTimeString})
              <div>
              {
                isCommentAuthor ||
                  <Button 
                    variant="danger"
                    onClick={commentReportUserIds.includes(currentUserId) ? () => { alert('이미 신고한 댓글입니다'); } : (currentUserId ? this.handleCommentReportButtonClick : null)} 
                    disabled={(currentUserId && !commentReportUserIds.includes(currentUserId)) ? false : true }
                    value={elem._id}
                  >
                    {commentReportUserIds.includes(currentUserId) ? '☎︎' : '☏'}&nbsp;{commentReportUserIds.length}
                  </Button>
              }
              { isCommentAuthor && (<span>☎︎&nbsp;{commentReportUserIds.length}</span>) }
              </div>
  
              {
                isCommentAuthor &&
                <ButtonGroup size="sm">
                  <Button variant="success" onClick={this.handleCommentUpdateButtonClick} value={elem._id}>댓글 수정</Button>
                  <Button variant="danger" onClick={this.handleCommentDeleteClick} value={elem._id}>댓글 삭제</Button>
                </ButtonGroup>
              }
              <br />
              {elem.value}
            </ListGroup.Item>
          );
        }
      }

      return (
        <Fragment>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>댓글</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl as="textarea" aria-label="comment" readOnly={!currentUserId} onClick={!currentUserId ? () => { alert("로그인 후 이용해주세요!") } : null} onChange={this.handleChange} name="commentValue" value={commentValue} />
            <InputGroup.Prepend>
              <Button type="submit" variant="primary" disabled={!currentUserId} onClick={this.handleCommentWriteSubmit}>
                등록
              </Button>
            </InputGroup.Prepend>
          </InputGroup>

          <div className="message">
            <span>{message}</span>
          </div>

          { comments.length <= 0 && <div>작성된 댓글이 없습니다.</div>}
          { comments.length > 0 && <ListGroup variant="flush">{CommentList.map(elem => elem)}</ListGroup>}

            <Modal
              show={this.state.commentUpdateModalShow}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton onClick={() => this.handleCommentUpdateModalHide()}>
                <Modal.Title id="contained-modal-title-vcenter">
                  댓글 수정하기
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Label>댓글 내용</Form.Label>
                <Form.Control as="textarea" name="body" rows="5" onChange={this.handleChange} name="commentUpdateValue" value={commentUpdateValue} />
                <br />
                <Button type="submit" variant="primary" onClick={this.handleCommentUpdateSubmit} disabled={!commentUpdateValue}>
                  수정
                </Button>
      
                <div className="message">
                  <span>{this.state.message}</span>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleCommentUpdateModalHide}>창 닫기</Button>
              </Modal.Footer>
            </Modal>

            <ReportModal
              show={this.state.commentReportModalShow}
              onHide={this.handleCommentReportModalHide}
              onSubmit={this.handleCommentReportSubmit}
            />
        </Fragment>
      );
    }
  }
}

export default BoardComment;
