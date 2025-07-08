import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n'; // Initialize i18n
import Layout from './components/Layout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import Detail from './pages/Detail';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminGirls from './pages/AdminGirls';
import AdminReviews from './pages/AdminReviews';
import LanguageDemo from './pages/LanguageDemo';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main" element={<Main />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/girls" element={<AdminGirls />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/demo" element={<LanguageDemo />} />
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
