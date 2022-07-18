import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import {
  createHttpLink,
  ApolloClient,
  ApolloProvider,
  InMemoryCache, 
  gql
} from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "./constants";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});

const authLink = setContext((_, { headers }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: authToken ? `Bearer ${authToken}` : ""
    }
  }
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);


const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  typeDefs: gql`
    enum Sort {
      asc
      desc
    }

    input LinkOrderByInput {
      url: Sort
      description: Sort
      createdAt: Sort
    }
  `  
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);