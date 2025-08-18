import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Create HTTP link
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_NHOST_GRAPHQL_URL || 'http://localhost:8080/v1/graphql',
});

// Auth link to add headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('nhost-auth-token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Log additional network error details
    if ('statusCode' in networkError) {
      console.error(`Status Code: ${(networkError as any).statusCode}`);
    }
    if ('bodyText' in networkError) {
      console.error(`Body: ${(networkError as any).bodyText}`);
    }
    
    // Log the GraphQL endpoint being used
    console.error(`GraphQL Endpoint: ${process.env.REACT_APP_NHOST_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'}`);
  }
});

// Create Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;
