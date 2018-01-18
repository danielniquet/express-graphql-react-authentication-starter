import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import 'dotenv/config';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import cors from 'cors';
import path from 'path';

import models from './models'
import auth from './auth'

//MERGE QUERIES AND RESOLVERS
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,resolvers,
});

const app = express();
app.use(cors({
  origin:["http://localhost:3001"]
}))
app.use(auth.getHeaders);


//GRAPHQL
const graphqlEndpoint = '/graphql';
app.use(graphqlEndpoint, bodyParser.json(),
  // (req, res, next) => {
  //   const context = { session:req.session }
  //   graphqlExpress({
  //     schema,
  //     context: {
  //       models,
  //       SECRET: process.env.SECRET,
  //       SECRET2: process.env.SECRET2,
  //       user: req.user,
  //       isAdmin: req.isAdmin,
  //       isTeacher: req.isTeacher,
  //     }
  //   })(req, res, next)
  // }
  graphqlExpress((req) => {
    console.log("req:",req.user);
    return {
    schema,
    context: {
      models,
      SECRET: process.env.SECRET,
      SECRET2: process.env.SECRET2,
      user: req.user,
      isAdmin: req.isAdmin,
      isTeacher: req.isTeacher,
    }
  }})
);
  //---LOAD GraphiQL IF DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.get('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint })); // if you want GraphiQL enabled
}



//SERVER
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}).then(
  () => {
    console.log('Conectado a Mongo!!!!')
    app.listen(process.env.PORT, ()=>{
      console.log('Running GRAPHQL server...');
    });
  }
)
