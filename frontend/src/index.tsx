import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { HookProvider } from './hooks/useHook';
import { BrowserRouter } from 'react-router-dom';

import "./index.css";
import 'katex/dist/katex.min.css';

const LINK = process.env.NODE_ENV === "production" ? "/" : "http://localhost:4000/";
const httpLink = new HttpLink({ uri: LINK });
const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <HookProvider>
          <App />
        </HookProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
