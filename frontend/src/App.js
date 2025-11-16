import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import Cities from './components/Cities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='cities' element={<Cities />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
