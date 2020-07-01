import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import BoardWriteModal from '../components/BoardWriteModal';
import { boardList } from '../lib/axios';
import cookies from '../lib/cookies';
import getFormattedDateTimeString from '../lib/getFormattedDateTimeString';

class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: null,
      createModalShow: false,
      searchString: '',
      sortKey: '1',
      message: null, // 검색, 정렬 관련해서는 검색어 유효성 검사만
    };
  }
  
  async componentDidMount() {
    const { searchString, sortKey } = this.state;
    await this.getBoards({ searchString, sortKey });
  }

  getBoards = async (param) => {
    try {
      if (!param.searchString) {
        delete param.searchString;
      }
      const res = await boardList(param);
      this.setState({
        boards: res.data.data,
      });
    }
    catch (err) {
      if (err && err.resposne) {
        const res = err.response;
        if (res.status === 500) {
          this.setState({
            message: "서버 오류로 게시판 불러오기를 실패했습니다.",
          });
        }
        else {
          alert("Unknown error")
        }
      }
      else {
        alert("Unknown error")
        console.log(err);
      }
    }
  }
 
  handleChange = async (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'sortKey') {
      const { searchString } = this.state;
      await this.getBoards({ searchString, sortKey: e.target.value });
    }
  }

  handleSearchValueSubmit = async (e) => {
    const { searchString, sortKey } = this.state;
    if (!(0 < searchString.length && searchString.length < 2)) {
      await this.getBoards({ searchString, sortKey });
    }
  }

  handleCreateButtonClick = (e) => {
    this.setState({
      createModalShow: true,
    });
  }

  handleCreateModalHide = (e) => {
    this.setState({
      createModalShow: false,
    });
  }

  handleUpdateBoards = async () => {
    this.setState({
      createModalShow: false,
    });
    const { searchString, sortKey } = this.state;
    await this.getBoards({ searchString, sortKey });
  }

  BoardHeader = () => {
    const { searchString, sortKey, message } = this.state;
    return (
      <Fragment>
        <div>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text><i className="fa fa-search"></i></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="검색어를 입력하세요"
              aria-describedby="basic-addon1"
              onChange={this.handleChange}
              name="searchString"
              defaultValue={searchString}
            />
            <InputGroup.Prepend>
              <Button type="submit" variant="primary" disabled={(0 < searchString.length && searchString.length < 2)} onClick={this.handleSearchValueSubmit}>
                검색
              </Button>
            </InputGroup.Prepend>
          </InputGroup>
          
          <div className="message">
            <span>{message}</span>
          </div>

          <div className="container--horizontal">
            <Form.Control className="item" style={{ flex: '0 0 50%' }} as="select" onChange={this.handleChange} defaultValue={sortKey} name="sortKey">
              <option value="1">최신순 (기본)</option>
              <option value="2">오래된순</option>
              <option value="3">좋아요순</option>
            </Form.Control>

            { 
              cookies.get('token') &&
              <Button className="item" style={{ flex: '0 0 20%' }} size="md" variant="outline-secondary" onClick={this.handleCreateButtonClick}>새 글 작성</Button>
            }
          </div>
      </div>
        
      </Fragment>
    );
  };
  render() {
    if (!this.state.boards) {
      return (
        <Loader 
          type="TailSpin"
          color="#00BFFF"
          height={70}
          width={70}
        />
      );
    }
    else if (this.state.boards.length === 0) {
      return (
        <Fragment>
          {this.BoardHeader()}
          <Alert variant="primary">
            작성된 글이 없습니다.
          </Alert>
        </Fragment>
      );
    }
    else {
      return (
        <div className="content">
          {this.BoardHeader()}
          <Table bordered hover className="board">
            <thead>
              <tr className="container--tr">
                <th style={{ maxWidth: '20%', flexBasis: '20%' }}>작성자</th>
                <th style={{ maxWidth: '30%', flexBasis: '30%' }}>제목</th>
                <th style={{ maxWidth: '20%', flexBasis: '20%' }}>작성일시</th>
                <th style={{ maxWidth: '15%', flexBasis: '15%' }}>좋아요 수</th>
                <th style={{ maxWidth: '15%', flexBasis: '15%' }}>신고 수</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.boards.map((elem, idx) => {
                  const d = new Date(elem.createdAt);
                  const formattedDateTimeString = getFormattedDateTimeString(d);
                  
                  return (
                      <tr key={idx} className="container--tr">
                        <td className="container--ellipsis" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                          <span className="ellipsis">
                            {elem.username || <span style={{color: 'red'}}>Unknown</span>}
                          </span>
                        </td>
                        <td className="container--ellipsis" style={{ maxWidth: '30%', flexBasis: '30%' }}>
                          <span className="ellipsis">
                            <Link to={`/board/${elem._id}`}>
                              {elem.title}
                            </Link>
                          </span>
                        </td>
                        <td className="container--ellipsis" style={{ maxWidth: '20%', flexBasis: '20%' }}>
                          <span className="ellipsis">
                            {formattedDateTimeString}
                          </span>
                        </td>
                        <td className="container--ellipsis" style={{ maxWidth: '15%', flexBasis: '15%' }}>
                          <span className="ellipsis">
                            {elem.likes}
                          </span>
                        </td>
                        <td className="container--ellipsis" style={{ maxWidth: '15%', flexBasis: '15%' }}>
                          <span className="ellipsis">
                            {elem.reports}
                          </span>
                        </td>
                      </tr>
                  );
                })
              }
            </tbody>
          </Table>

          <BoardWriteModal
            show={this.state.createModalShow}
            onHide={this.handleCreateModalHide}
            history={this.props.history}
            onSubmit={() => this.handleUpdateBoards()}
          />
        </div>
      );
    }
  }
}

export default BoardList;