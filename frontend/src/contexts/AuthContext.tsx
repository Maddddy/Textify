import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthenticationStatus, useSignInEmailPassword, useSignUpEmailPassword, useSignOut, useUserData } from '@nhost/react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const { signInEmailPassword, isLoading: signInLoading } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: signUpLoading } = useSignUpEmailPassword();
  const { signOut: nhostSignOut } = useSignOut();

  const user = useUserData();

  const signIn = async (email: string, password: string) => {
    return await signInEmailPassword(email, password);
  };

  const signUp = async (email: string, password: string) => {
    return await signUpEmailPassword(email, password);
  };

  const signOut = async () => {
    return await nhostSignOut();
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading: isLoading || signInLoading || signUpLoading,
    user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
