import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from './models';
import 'dotenv/config';

const auth = {
  getTokens:  ({_id, isAdmin, isTeacher}, SECRET, SECRET2 )=>{
    const token = jwt.sign({user: _id, isAdmin, isTeacher}, SECRET, { expiresIn: '1h'})
    const refreshToken = jwt.sign({user: _id}, SECRET2, { expiresIn: '7d'})

    return [token,refreshToken];
  },
  login: async (username, password, User, SECRET, SECRET2)=>{
    const user = await User.findOne({username})
    if(!user){
      return {
        success:false,
        errors:[{path:'username', message:'Username does not exist'}]
      }
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
      return {
        success:false,
        errors:[{path:'password', message:'Invalid Password'}]
      }
    }
    // console.log("user:[auth.login]",user);
    const refreshTokenSecret = user.password + SECRET2;
    // console.log('refreshTokenSecret:[auth.login]',user.password,SECRET2,refreshTokenSecret);
    const [token,refreshToken] = auth.getTokens(user, SECRET, refreshTokenSecret)

    return {
      success: true,
      token,
      refreshToken,
      errors: []
    }
  },
  refreshTokens: async (token, refreshToken, models, SECRET, SECRET2) => {
    let userId = 0, admin=false;
    try {
      // const { user: { _id } } = jwt.decode(refreshToken);
      const {user} = jwt.decode(refreshToken);
      userId = user;
    } catch (err) {
      return {};
    }

    if (!userId) {
      return {};
    }

    const user = await models.User.findOne({ _id: userId });
    if (!user) {return {};}

    const refreshSecret = user.password + SECRET2;

    // console.log('xxxxx',refreshToken, refreshSecret);
    try {
      jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return {};
    }

    const [newToken, newRefreshToken] = await auth.getTokens(user, SECRET, refreshSecret);
    return {
      token: newToken,
      refreshToken: newRefreshToken,
      // user: user._id,
      isAdmin: user.isAdmin,
      isTeacher: user.isTeacher,
    };
  },
  getHeaders: async (req, res, next)=> {
    const token = req.headers['x-token'];
    // console.log('token[auth.getHeaders]:', token);
    if (token) {
      try {
        const { user, isAdmin, isTeacher } = jwt.verify(token, process.env.SECRET);
        // console.log('user[auth.getHeaders]:',  user);
        req.user = user;
        req.isAdmin = isAdmin;
        req.isTeacher = isTeacher;
      } catch (err) {
        const refreshToken = req.headers['x-refresh-token'];
        const newTokens = await auth.refreshTokens(token, refreshToken, models, process.env.SECRET, process.env.SECRET2);
        // console.log('newTokens[auth.getHeaders]:',  newTokens);

        if (newTokens.token && newTokens.refreshToken) {
          res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
          res.set('x-token', newTokens.token);
          res.set('x-refresh-token', newTokens.refreshToken);
        }
        req.user = newTokens.user;
        req.isAdmin = newTokens.isAdmin;
        req.isTeacher = newTokens.isTeacher;
      }
    }
    next();
  }
}

export default auth;
