import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSession } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  const session = getSession();

  if (!currentUser && !session) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
