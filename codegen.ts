import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/typeDefs.ts',
  generates: {
    'src/graphql/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: {
          DateTime: 'string',
        },
        contextType: './context#DataSourceContext',
        mappers: {
          Organization: './models#OrganizationModel',
          OrganizationMember: './models#OrganizationMemberModel',
          Event: './models#EventModel',
          EventMember: './models#EventMemberModel',
          Proposal: './models#ProposalModel',
        },
      },
    },
  },
};

export default config;
