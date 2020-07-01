import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Button, ButtonGroup } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import BoardWriteModal from '../components/BoardWriteModal';
import BoardModifyModal from '../components/BoardModifyModal';
import ReportModal from '../components/ReportModal';
import BoardComment from '../components/BoardComment';
import { board, boardDelete, boardLike, boardLikeCancel, boardReport } from '../lib/axios';
import cookies from '../lib/cookies';
import getFormattedDateTimeString from '../lib/getFormattedDateTimeString';

class BoardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      likedByMe: false,
      reportedByMe: false,
      createModalShow: false,
      updateModalShow: false,
      boardReportModalShow: false,
      message: null,
    };
  }

  async componentDidMount() {
    await this.getBoard(this.props.match.params.id);
  }

  getBoard = async () => {
    try {
      const { data } = await board(this.props.match.params.id);
      const reportUserIds = data.data.reports.map(elem => elem.userId);
      const { userId } = this.props.currentUser || { userId: '' };
      this.setState({
        likedByMe: userId ? data.data.likes.includes(userId || '') : false,
        reportedByMe: userId ? reportUserIds.includes(userId || '') : false,
        board: data.data,
      });
    }
    catch (err) {
      if (err && err.resposne) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "찾을 수 없는 게시글입니다.",
          })
        }
        else if (res.status === 404) {
          this.setState({
            message: "삭제된 게시글입니다.",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 게시글 불러오기를 실패했습니다.",
          });
        }
        else {
          alert("Unknown error");
          this.setState({
            message: "Unknown error",
          });
        }
      }
      else {
        alert("Unknown error");
        this.setState({
          message: "Unknown error",
        });
        console.log(err);
      }
    }
  }

  handleCreateButtonClick = (e) => {
    this.setState({
      createModalShow: true,
    });
  }

  handleUpdateButtonClick = (e) => {
    this.setState({
      updateModalShow: true,
    });
  }

  handleBoardReportButtonClick = (e) => {
    this.setState({
      boardReportModalShow: true,
    });
  }


  handleCreateModalHide = (e) => {
    this.setState({
      createModalShow: false,
    });
  }

  handleUpdateModalHide = (e) => {
    this.setState({
      updateModalShow: false,
    });
  }

  handleUpdateBoard = (title, body) => {
    this.setState((state) => ({
      updateModalShow: false,
      board: { ...state.board, ...{title, body} },
    }));
  }

  handleBoardReportModalHide = (e) => {
    this.setState({
      boardReportModalShow: false,
    });
  }

  handleDeleteButtonClick = async (e) => {
    try {
      await boardDelete(this.state.board._id);
      this.props.history.push('/boards');
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "글을 삭제할 수 없습니다",
          });
        }
        else if (res.status === 404) {
          this.setState({
            message: "글이 정상적으로 삭제되지 않았습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 글을 삭제할 수 없습니다",
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

  handleLikeClick = async (e) => {
    try {
      if (this.state.likedByMe) { // true -> 좋아요 취소
        await boardLikeCancel(this.state.board._id);
      }
      else { // false -> 좋아요
        await boardLike(this.state.board._id);
      }
      await this.getBoard(this.props.match.params.id);
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "좋아요 기능을 이용할 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 좋아요 기능을 이용할 수 없습니다",
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

  handleReportSubmit = async (code) => { // code는 기타인 경우 value다.
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
        await boardReport(this.state.board._id, { code, value });
        this.setState({
          boardReportModalShow: false,
        });
        await this.getBoard(this.props.match.params.id);
    }
    catch (err) {
      if (err && err.response) {
        const res = err.response;
        if (res.status === 400) {
          this.setState({
            message: "글을 신고할 수 없습니다",
          });
        }
        else if (res.status === 500) {
          this.setState({
            message: "서버 오류로 글을 신고할 수 없습니다",
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
    const { board, likedByMe, reportedByMe, message } = this.state;
    const { userId: currentUserId } = cookies.get('token') ? this.props.currentUser : { userId: '' };
    if (!board && message) {
      return (
        <div className="message">
          <span>{message}</span>
        </div>
      );
    }
    else if (!board) {
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
      const d = new Date(board.createdAt);
      const formattedDateTimeString = getFormattedDateTimeString(d);
      
      return (
        <div className="content">
          <Navbar>
            <h2>{board.title}</h2>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text style={{textAlign: "right"}}>
                작성자 {board.username ? <span style={{ color: 'black' }}>{board.username}</span> : <span style={{ color: 'red' }}>Unknown</span>}
                <br />
                {formattedDateTimeString}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>

          <div className="content--view">
            {board.body}
          </div>

          <br />

          <div>
            <span
              onClick={ currentUserId ? this.handleLikeClick : () => { alert("로그인 후 이용해주세요!") } }
              style={{ color: 'red', cursor: 'pointer' }}
            >
              {likedByMe ? '♥︎' : '♡' }&nbsp;
            </span>
            {board.likes.length}
          </div>

          <div>
            {
              (currentUserId === board.userId) || (
                <Button 
                  variant="danger"
                  onClick={reportedByMe ? () => { alert('이미 신고한 게시글입니다'); } : ((currentUserId) ? this.handleBoardReportButtonClick : () => { alert("로그인 후 이용해주세요!") })} 
                  disabled={(currentUserId) ? false : true}
                  >
                  {reportedByMe ? '☎︎' : '☏'}&nbsp;{board.reports.length}
                </Button>
              )
            }
            { (currentUserId === board.userId) && (<span>☎︎&nbsp;{board.reports.length}</span>) }
          </div>

          <br />

          {
            (currentUserId === board.userId) &&
            <ButtonGroup size="md">
              <Button variant="outline-success" onClick={this.handleUpdateButtonClick}>글 수정</Button>
              <Button variant="outline-danger" onClick={this.handleDeleteButtonClick}>글 삭제</Button>
            </ButtonGroup>
          }

          <div className="message">
            <span>{message}</span>
          </div>

          <BoardComment
            currentUserId={currentUserId}
            boardid={board._id}
            comments={board.comments}
            getBoard={() => this.getBoard()}
          />

          { currentUserId ? null :
            <BoardWriteModal
              show={this.state.createModalShow}
              onHide={this.handleCreateModalHide}
              history={this.props.history}
            />
          }

          { (currentUserId === board.userId) &&
            <BoardModifyModal
              show={this.state.updateModalShow}
              onHide={this.handleUpdateModalHide}
              boardid={board._id}
              authorid={board.userId}
              title={board.title}
              body={board.body}
              onSubmit={(title, body) => this.handleUpdateBoard(title, body)}
            />
          }

          {(currentUserId === board.userId || reportedByMe) || 
            <ReportModal
              show={reportedByMe || this.state.boardReportModalShow}
              onHide={this.handleBoardReportModalHide}
              onSubmit={this.handleReportSubmit}
            />
          }
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.userStore.currentUser,
});

export default connect(mapStateToProps, null)(BoardView);
