import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  ApolloClient, InMemoryCache, ApolloProvider, HttpLink,
} from '@apollo/client';
import { HookProvider } from './hook/usehook';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/',
});


const client = new ApolloClient({ 
  link: httpLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HookProvider>
        <App />
      </HookProvider>
    </ApolloProvider>
  </React.StrictMode>
);
