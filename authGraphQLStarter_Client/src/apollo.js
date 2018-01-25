import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const hostname = window && window.location && window.location.hostname;
const graphqlHost = (hostname === 'math4kids2.herokuapp.com')?'https://math4kids2.herokuapp.com/graphql':'http://localhost:3000/graphql';

const httpLink = createHttpLink({ uri: graphqlHost});
const AUTH_TOKEN="token"
const REFRESH_TOKEN="refreshToken"

const middleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const refresh_token = localStorage.getItem(REFRESH_TOKEN)
  if (token) {
    operation.setContext({
      headers: {
        'x-token': token,
        'x-refresh-token': refresh_token
      }
    })
  }
  return forward(operation)
})

const afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext()
    const { response: { headers } } = context
    if (headers) {
      const token = headers.get("x-token")
      const refresh_token = headers.get("x-refresh-token")
      if (token) {
        localStorage.setItem(AUTH_TOKEN, token)
        localStorage.setItem(REFRESH_TOKEN, refresh_token)
      }
    }

    // //Se puede manipular datos cuando llegan de graphql
    // if (response.data.user.lastLoginDate) {
    //
    // }

    //redireccionar en caso de error
    if(response.errors && response.errors.length>0){
      if(response.errors[0].message==='Not authenticated'){
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location = "/login"
      }
    }
    return response;
  })
})


const link = afterware.concat(middleware.concat(httpLink));

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
});
