import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current URL they tried to go to
    // so they can be redirected there after logging in, if desired.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;