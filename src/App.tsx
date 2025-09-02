import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import DetailedView from './pages/DetailedView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/gallery" element={<Gallery />}/>
        <Route path="/:num" element={<DetailedView />}/>
      </Routes>
    </Router>
  );
}

export default App;
