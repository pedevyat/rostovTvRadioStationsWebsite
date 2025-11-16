import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import Cities from './components/Cities'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cities" elememt={<Cities />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
