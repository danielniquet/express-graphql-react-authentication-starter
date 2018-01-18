import bcrypt from 'bcrypt';
import auth from '../auth';
import formatErrors from '../formatErrors';
import requiresAuth, { requiresAdmin,requiresTeacher } from '../permissions';


export default {
  Query: {
    me: requiresAuth.createResolver( (parent, args, { models, user }) => models.User.findOne({ _id: user }) ),
    allUsers: requiresAuth.createResolver(async (parent, args, {models}) => {
      try {
        const user = await models.User.find();
        return user;
      } catch (err) {
        console.log('xxx',err);
        return null;
      }
    }),
    getUser: requiresAdmin.createResolver(async (parent, args, {models}) => {
      try {
        const user = await models.User.findOne(args);
        return user;
      } catch (err) {
        console.log(err);
        return null;
      }
    }),
    allUsersTeacher: requiresTeacher.createResolver(async (parent, args, {models}) => {
      try {
        const user = await models.User.find();
        return user;
      } catch (err) {
        console.log(err);
        return null;
      }
    }),
  },
  Mutation: {
    login: async (parent, {username, password}, {models:{User}, SECRET, SECRET2, user})=> auth.login(username, password, User, SECRET, SECRET2),
    createUser: async (parent, {password, ...args}, {models:{User}, SECRET, SECRET2}) => {
      const otherErrors = []
      let login=null
      try{
        if(password.length<8){
          otherErrors.push({path: 'password', message:'Password must be greater than 8 characters'})
        }
        if(otherErrors.length){
          throw otherErrors;
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({...args, password: hashPassword})
        if(user && user._id){
          login = await auth.login(user.username, password, User, SECRET, SECRET2);
        }
        return login || {
          success: user && user._id,
          errors: []
        };
      }catch(error){
        return {
          success: false,
          errors: formatErrors(error,otherErrors)
        };
      }
    }
  }
}
