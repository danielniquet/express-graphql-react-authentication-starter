import gpl from 'graphql-tag';

export default {
  query:{
    me:gpl`{
      me {
        username
      }
    }
    `,
  },
  mutation:{
    login:gpl`mutation($username: String!,$password:String!){
        login(username:$username,password:$password) {
          success
          token
          refreshToken
          errors{
            path
            message
          }
        }
      }`,
    signup: gpl`
      mutation($username: String!,$password:String!){
        createUser(username:$username,password:$password){
          success
          token
          refreshToken
          errors{
            path
            message
          }
        }
      }
    `
  }
}
