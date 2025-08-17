import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './AuthPage';
import ChatPage from './ChatPage';
import LoadingSpinner from './LoadingSpinner';

const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <ChatPage />;
};

export default AppRouter;
