// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = () => {
  const token = Cookie.get('jwt_token');

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; // ✅ Default export
