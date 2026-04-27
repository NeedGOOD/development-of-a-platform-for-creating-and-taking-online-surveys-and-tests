import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }) {
  const { ready, user } = useAuth();
  const location = useLocation();

  if (!ready) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

