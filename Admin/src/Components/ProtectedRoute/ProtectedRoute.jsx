import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('admin-auth-token');
  const adminData = localStorage.getItem('admin-data');

  if (!adminToken || !adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    // Verify token is valid JSON
    JSON.parse(adminData);
  } catch (error) {
    // If admin data is corrupted, clear it and redirect to login
    localStorage.removeItem('admin-auth-token');
    localStorage.removeItem('admin-data');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 