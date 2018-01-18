import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Switch,
  Redirect
} from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './home';
import Login from './login';
import Me from './me';



const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};
const signout = (cb) => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  setTimeout(cb, 100)
}
const AuthButton = withRouter(({ history }) => (
  isAuthenticated() ? (
    <p>
      Welcome! <button onClick={() => {
        signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in. <Link to="/login">Login</Link></p>
  )
))


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{pathname: '/login',}}
        />
      ))}
  />
);

const xx = <div>home2</div>


export default ()=>(
  <Router>
    <div>
        <AuthButton/>
      <Switch>
        <Route exact path="/" render={props => <Home {...props} logged={isAuthenticated()} />}/>
        <Route path="/login" render={props => <Login {...props} logged={isAuthenticated()} />} />
        <PrivateRoute path="/me" component={Me}/>
      </Switch>
    </div>
  </Router>
)
