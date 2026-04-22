import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ children, allow = [] }) => {
  const { isAuthReady, isLoggedIn, isAdmin, isAlumnus, isStudent } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" aria-hidden="true" />
          <p className="mt-3 mb-0 text-muted">Loading protected page...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.length) {
    return children;
  }

  const roleAllowed =
    (allow.includes('admin') && isAdmin) ||
    (allow.includes('alumnus') && isAlumnus) ||
    (allow.includes('student') && isStudent);

  if (!roleAllowed) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    if (isStudent) {
      return <Navigate to="/student-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    children
  );
}

export default PrivateRoute;
