import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screen/Home';
import QrScreen from './screen/QrScreen';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qr" element={<QrScreen />} />
        </Routes>
      </Router>
  );
}

export default App;
