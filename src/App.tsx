import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import Detail from './pages/Detail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
