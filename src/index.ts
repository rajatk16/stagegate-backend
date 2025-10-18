import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { gql } from 'graphql-tag';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { initializeApp, cert } from 'firebase-admin/app';
import { expressMiddleware } from '@as-integrations/express5';

import { createContext } from './graphql/context';

dotenv.config();

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || process.env.FIREABSE_PROJECT_ID;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PORT = process.env.PORT || 3000;

initializeApp({
  credential: cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  }),
});

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
        return await createContext(req);
      },
    }),
  );
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
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
