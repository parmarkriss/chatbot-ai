import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPages from './pages/LoginPages';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPages />} />
      </Routes>
    </Router>
  );
}

export default App;
