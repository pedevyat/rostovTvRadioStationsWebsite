import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import Cities from './components/Cities';
import Radiostations from './components/Radiostations';
import About from './components/About';
import City from './components/City';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='cities' element={<Cities />} />
          <Route path='cities/:cityName' element={<City />} />
          <Route path='stations' element={<Radiostations />} />
          <Route path='about' element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
