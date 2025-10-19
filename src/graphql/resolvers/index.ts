import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

import { Resolvers } from '../types';
import { DataSourceContext } from '../context';

const resolversArray = loadFilesSync(path.join(__dirname, './**/*.resolver.*'));
export const resolvers: Resolvers<DataSourceContext> = mergeResolvers(resolversArray);
