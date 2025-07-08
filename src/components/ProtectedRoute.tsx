import React from 'react';
import { Navigate } from 'react-router-dom';
import { apiService } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/signin'
}) => {
  const isAuthenticated = apiService.isAuthenticated();
  const user = apiService.getUser();
  const isAdmin = user?.role === 'admin';

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - requireAuth:', requireAuth);
  console.log('ProtectedRoute - requireAdmin:', requireAdmin);

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('ProtectedRoute - redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // If admin role is required but user is not admin
  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute - redirecting to main (not admin)');
    return <Navigate to="/main" replace />;
  }

  // If user is authenticated but trying to access auth pages, redirect to main
  if (isAuthenticated && (redirectTo === '/signin' || redirectTo === '/signup')) {
    console.log('ProtectedRoute - redirecting to main (already authenticated)');
    return <Navigate to="/main" replace />;
  }

  console.log('ProtectedRoute - rendering children');
  return <>{children}</>;
};

export default ProtectedRoute; 