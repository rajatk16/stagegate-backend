import { GraphQLError } from 'graphql';
import { QueryResolvers } from '../../../types';

export const authStatus: QueryResolvers['authStatus'] = async (_parent, _args, context) => {
  if (!context.authUser)
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHORIZED',
        http: {
          status: 401,
        },
      },
    });

  const firebaseUser = await context.auth.getUser(context.authUser.uid);

  return {
    uid: context.authUser.uid,
    email: firebaseUser.email ?? '',
    emailVerified: firebaseUser.emailVerified,
  };
};
