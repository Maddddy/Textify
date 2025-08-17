import React from 'react';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { nhost } from './lib/nhost';
import client from './lib/apollo';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ChatProvider>
            <div className="App">
              <AppRouter />
            </div>
          </ChatProvider>
        </AuthProvider>
      </ApolloProvider>
    </NhostProvider>
  );
}

export default App;
