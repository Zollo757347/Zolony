import * as fs from 'fs'
import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import {UserModel, MapModel} from './models'

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

    
const yoga = createYoga({
  schema: createSchema({
  typeDefs: fs.readFileSync('./src/schema.graphql', 'utf-8'),
  resolvers: {
    Query,
    Mutation,   
  },
  }),
  context: {
    MapModel,
    UserModel,
  },
  graphqlEndpoint: '/',
});

const server = createServer(yoga);
export default server;
