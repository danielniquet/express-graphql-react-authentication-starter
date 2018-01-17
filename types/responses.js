export default `
  type Response {
    success: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }
`;
