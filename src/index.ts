import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { gql } from 'graphql-tag';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { buildContext } from './graphql/context';

dotenv.config();

const PORT = process.env.PORT || 3000;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        return await buildContext(req);
      },
    }),
  );
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server running at PORT ${PORT} at PATH /graphql`);
  });
};

startServer()
  .then(() => {
    console.log('Server is running on port 3000');
  })
  .catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
  });
