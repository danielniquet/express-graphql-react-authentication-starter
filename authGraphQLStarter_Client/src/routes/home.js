import React from 'react';
import {Link} from 'react-router-dom';
import {Container} from 'semantic-ui-react';

const Admin = ()=><h1>home logged admin</h1>
const Teacher = ()=><h1>home logged teacher</h1>
const User = ()=><h1>home logged user</h1>
const NotLogged = ()=><h1>home <Link to="/login">Login</Link></h1>

class Home extends React.Component{
  render(){
    const {logged} = this.props;
    if(!logged){
      return <NotLogged />
    }

    const {isAdmin, isTeacher} = logged
    return (
      <Container>
        {
          isAdmin && <Admin />
        }
        {
          isTeacher && <Teacher />
        }
        {
          !isAdmin && !isTeacher && <User />
        }
      </Container>
    )

  }
}

export default Home
