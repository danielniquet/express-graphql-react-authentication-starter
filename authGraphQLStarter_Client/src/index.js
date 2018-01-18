import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import 'semantic-ui-css/semantic.min.css';

const hostname = window && window.location && window.location.hostname;
const graphqlHost = (hostname === 'math4kids2.herokuapp.com')?'https://math4kids2.herokuapp.com/graphql':'http://localhost:3000/graphql';

const httpLink = createHttpLink({ uri: graphqlHost });

const middlewareLink = setContext(() => ({headers: {
  'x-token': localStorage.getItem('token') || null,
  'x-refresh-token': localStorage.getItem('refreshToken') || null,
}}) );

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const {headers} = operation.getContext();

    if (headers) {
     const token = headers['x-token'];
     const refreshToken = headers['x-refresh-token'];
     if (token) {
       localStorage.setItem('token', token);
     }
     if (refreshToken) {
       localStorage.setItem('refreshToken', refreshToken);
     }
   }

    return response;
  });
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));


const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App =
<ApolloProvider client={client}>
  <Routes />
</ApolloProvider>

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
