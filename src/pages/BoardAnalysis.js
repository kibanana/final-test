import React, { Component } from 'react';
import { Table, Alert } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import { boardListAnalyze } from '../lib/axios';

class BoardAnalysis extends Component {
  state = {
    analysis: null,
  };
  async componentDidMount() {
    try {
      const { data } = await boardListAnalyze(this.props.match.params.id);
      this.setState({
        analysis: data.data,
      });
    }
    catch (err) {
      if (err && err.resposne) {
        const res = err.response;
        if (res.status === 500) {
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
  
  render() {
    if (!this.state.analysis) {
      return (
        <Loader 
          type="TailSpin"
          color="#00BFFF"
          height={70}
          width={70}
        />
      );
    }
    else if (this.state.analysis.length === 0) {
      return (
        <Alert variant="primary">
          통계가 없습니다.
        </Alert>
      );
    }
    else {
      return (
        <div className="content">
          <Table bordered hover className="board">
            <thead>
              <tr className="container--tr">
                <th style={{ maxWidth: '40%', flexBasis: '40%' }}>/</th>
                <th style={{ maxWidth: '30%', flexBasis: '30%' }}>작성글 수</th>
                <th style={{ maxWidth: '30%', flexBasis: '30%' }}>좋아요 수</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.analysis.map((elem, idx) => {
                  return (
                    <tr key={idx} className="container--tr">
                      <td style={{ maxWidth: '40%', flexBasis: '40%' }}>{elem.username || <span style={{color: 'red'}}>Unknown</span>}</td>
                      <td style={{ maxWidth: '30%', flexBasis: '30%' }}>{elem.boardCnt}</td>
                      <td style={{ maxWidth: '30%', flexBasis: '30%' }}>{elem.likeCnt}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </Table>
        </div>
      );
    }
  }
}

export default BoardAnalysis;
