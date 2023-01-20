import express from 'express';
import fs from 'fs';
import path from 'path';
import { createSchema, createYoga } from 'graphql-yoga';
import { MapModel, UserModel } from './models';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';

const server = express();

const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync('./src/schema.graphql', 'utf-8'),
    resolvers: { Query, Mutation }
  }),
  context: { MapModel, UserModel },
  graphqlEndpoint: '/'
});

if (process.env.NODE_ENV === "production") {
  console.log("The app now runs in production mode.");

  const __dirname = path.resolve();
  server.use(express.static(path.join(__dirname, "../frontend", "build")));
  server.get("/*", function (_req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

server.use('/', yoga);
export default server;
