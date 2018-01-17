export default `
  type User{
    _id: ID!
    username: String!
    password: String!
    name: String
    StudentID: String
    confirmed: Boolean
    active: Boolean
    isTeacher: Boolean
    isAdmin: Boolean
  }

  type Query{
    me: User!
    allUsers: [User]!
    allUsersTeacher: [User]!
    getUser(_id: ID!): User!
  }

  type Mutation{
    login(username: String!, password: String!): Response!
    createUser(username: String!, password: String!): Response!
  }
`;
