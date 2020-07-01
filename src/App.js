import React from 'react';
import './App.css';
import Header from './components/Header';
import Pages from './pages';

const App = () => {
  return (
    <div className="App">
      <div className="App-header">
        <Header />
      </div>
      <Pages className="content" />
    </div>
  );
}

export default App;
