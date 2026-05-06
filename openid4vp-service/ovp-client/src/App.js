import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screen/Home';
import QrScreen from './screen/QrScreen';
import VerifyScreen from "./screen/VerifyScreen";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qr" element={<QrScreen />} />
          <Route path="/verify" element={<VerifyScreen />} />
        </Routes>
      </Router>
  );
}

export default App;
