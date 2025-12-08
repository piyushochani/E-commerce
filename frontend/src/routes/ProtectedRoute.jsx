import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${requiredRole}/login`} replace />;
  }

  if (userType !== requiredRole) {
    return <Navigate to={`/${userType}/home`} replace />;
  }

  return children;
};

export default ProtectedRoute;