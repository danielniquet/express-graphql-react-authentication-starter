import React from 'react';
import {Container,Button, Divider, Form,Message} from 'semantic-ui-react';
import {graphql, compose} from 'react-apollo';
import queries from '../queries';

class Login extends React.Component{
  state={
    username:'',
    password:'',
    errorSignin: [],
    loadingForm: false,
    registeredUser: false,
  }
  handleChange = ({target:{name,value}})=>{
    this.setState(newState=>({[name]:value}))
  }
  handleSubmit = async (ev)=>{
    ev.preventDefault()
    const {registeredUser} = this.state;
    this.setState({loadingForm:true})

    const {username,password} = this.state;
    const {data:{[registeredUser?'login':'createUser']:{success, token, refreshToken, errors}}} = await this.props[registeredUser?'login':'signup']({
      variables: {username,password}
    })
    if(!success){
      this.setState({errorSignin:errors, loadingForm:false})
    }else if(token && refreshToken){
      this.setState({errorSignin:[], loadingForm:false})
      localStorage.setItem('token',token);
      localStorage.setItem('refreshToken',refreshToken);
      this.props.history.push('/me')
    }
  }
  handleRegisteredUser = (ev)=>{
    ev.preventDefault()
    this.setState(newState=>{
      return {registeredUser:!newState.registeredUser}
    })
  }
  componentDidMount(){
    const {logged} = this.props;
    if(logged){
      this.props.history.push('/me')
    }
  }
  render(){
    const errors = this.state.errorSignin;
    const {loadingForm, registeredUser} = this.state;

    return (
      <Container text>
        <Form size={'tiny'} onSubmit={this.handleSubmit} loading={loadingForm}>
          <Form.Group widths='equal'>
            <Form.Field name="username" label='Username' control='input' placeholder='Username' onChange={this.handleChange} />
            <Form.Field name="password" label='Password' control='input' type="password" placeholder='Password' onChange={this.handleChange} />
          </Form.Group>
          <Button type='submit'>{registeredUser?'SignIn':'SignUp'}</Button><br />
          {
            !registeredUser && (
              <a href="" onClick={this.handleRegisteredUser}>Already registered? SignIn</a>
            )
          }
          {
            registeredUser && (
              <a href=""  onClick={this.handleRegisteredUser}>Not registered? SignUp</a>
            )
          }
          <Divider hidden />
          {
            errors.length?<Message negative header="Errors:"
              list={errors.map(error=>`[${error.path}] ${error.message}`)} />:null
          }
        </Form>
      </Container>
    )
  }
}

export default compose(
  graphql(queries.mutation.login, {name:"login"}),
  graphql(queries.mutation.signup, {name:"signup"}),
)(Login);
