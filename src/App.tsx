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
import AdminSettings from './pages/AdminSettings';
import LanguageDemo from './pages/LanguageDemo';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes - không dùng Layout chung */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/girls" element={<AdminGirls />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        
        {/* Public routes - dùng Layout chung */}
        <Route path="/signin" element={<Layout><SignIn /></Layout>} />
        <Route path="/signup" element={<Layout><SignUp /></Layout>} />
        <Route path="/main" element={<Layout><Main /></Layout>} />
        <Route path="/detail" element={<Layout><Detail /></Layout>} />
        <Route path="/demo" element={<Layout><LanguageDemo /></Layout>} />
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
