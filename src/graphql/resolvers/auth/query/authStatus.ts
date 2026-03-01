import { QueryResolvers } from '../../../types';
import { unauthorizedError } from '../../../../utils';

export const authStatus: QueryResolvers['authStatus'] = async (_parent, _args, context) => {
  if (!context.authUser) {
    throw unauthorizedError();
  }

  const firebaseUser = await context.auth.getUser(context.authUser!.uid);

  return {
    uid: context.authUser!.uid,
    email: firebaseUser.email ?? '',
    emailVerified: firebaseUser.emailVerified,
  };
};
