import { GraphQLError } from 'graphql';

export const badUserInputError = (message: string) =>
  new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
      http: {
        status: 400,
      },
    },
  });

export const unauthorizedError = () =>
  new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED',
      http: {
        status: 401,
      },
    },
  });

export const forbiddenError = (message: string) =>
  new GraphQLError(message, {
    extensions: {
      code: 'FORBIDDEN',
      http: {
        status: 403,
      },
    },
  });

export const notFoundError = (message: string) =>
  new GraphQLError(message, {
    extensions: {
      code: 'NOT_FOUND',
      http: {
        status: 404,
      },
    },
  });

export const internalServerError = (message?: string) => {
  return new GraphQLError(message ?? 'Internal server error', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      http: {
        status: 500,
      },
    },
  });
};
