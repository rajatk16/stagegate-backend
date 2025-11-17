import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DataSourceContext } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  email: Scalars['String']['output'];
  uid: Scalars['ID']['output'];
  user: User;
};

export type AuthStatus = {
  __typename?: 'AuthStatus';
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  uid: Scalars['ID']['output'];
};

export type ContactInfo = {
  __typename?: 'ContactInfo';
  phone?: Maybe<Scalars['String']['output']>;
  secondaryEmail?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type ContactInfoInput = {
  phone?: InputMaybe<Scalars['String']['input']>;
  secondaryEmail?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type Location = {
  __typename?: 'Location';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
};

export type LocationInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteProfilePicture: User;
  signUp: AuthPayload;
  updateProfilePicture: User;
  updateUser: User;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type MutationUpdateProfilePictureArgs = {
  url: Scalars['String']['input'];
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Occupation = {
  __typename?: 'Occupation';
  company?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type OccupationInput = {
  company?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  authStatus?: Maybe<AuthStatus>;
  me?: Maybe<User>;
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SocialMedia = {
  __typename?: 'SocialMedia';
  handle: Scalars['String']['output'];
  platform: Scalars['String']['output'];
};

export type SocialMediaInput = {
  handle: Scalars['String']['input'];
  platform: Scalars['String']['input'];
};

export type UpdateUserInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  contactInfo?: InputMaybe<ContactInfoInput>;
  location?: InputMaybe<LocationInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  occupation?: InputMaybe<OccupationInput>;
  socialMedia?: InputMaybe<Array<SocialMediaInput>>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  contactInfo?: Maybe<ContactInfo>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Location>;
  name: Scalars['String']['output'];
  occupation?: Maybe<Occupation>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  socialMedia?: Maybe<Array<SocialMedia>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  AuthStatus: ResolverTypeWrapper<AuthStatus>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ContactInfo: ResolverTypeWrapper<ContactInfo>;
  ContactInfoInput: ContactInfoInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Location: ResolverTypeWrapper<Location>;
  LocationInput: LocationInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Occupation: ResolverTypeWrapper<Occupation>;
  OccupationInput: OccupationInput;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SignUpInput: SignUpInput;
  SocialMedia: ResolverTypeWrapper<SocialMedia>;
  SocialMediaInput: SocialMediaInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  AuthStatus: AuthStatus;
  Boolean: Scalars['Boolean']['output'];
  ContactInfo: ContactInfo;
  ContactInfoInput: ContactInfoInput;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Location: Location;
  LocationInput: LocationInput;
  Mutation: Record<PropertyKey, never>;
  Occupation: Occupation;
  OccupationInput: OccupationInput;
  Query: Record<PropertyKey, never>;
  SignUpInput: SignUpInput;
  SocialMedia: SocialMedia;
  SocialMediaInput: SocialMediaInput;
  String: Scalars['String']['output'];
  UpdateUserInput: UpdateUserInput;
  User: User;
};

export type AuthPayloadResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload'],
> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type AuthStatusResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['AuthStatus'] = ResolversParentTypes['AuthStatus'],
> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type ContactInfoResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['ContactInfo'] = ResolversParentTypes['ContactInfo'],
> = {
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondaryEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type LocationResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location'],
> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  deleteProfilePicture?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  signUp?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, 'input'>
  >;
  updateProfilePicture?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProfilePictureArgs, 'url'>
  >;
  updateUser?: Resolver<
    ResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >;
};

export type OccupationResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Occupation'] = ResolversParentTypes['Occupation'],
> = {
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  authStatus?: Resolver<Maybe<ResolversTypes['AuthStatus']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type SocialMediaResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['SocialMedia'] = ResolversParentTypes['SocialMedia'],
> = {
  handle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactInfo?: Resolver<Maybe<ResolversTypes['ContactInfo']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  occupation?: Resolver<Maybe<ResolversTypes['Occupation']>, ParentType, ContextType>;
  profilePicture?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  socialMedia?: Resolver<Maybe<Array<ResolversTypes['SocialMedia']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type Resolvers<ContextType = DataSourceContext> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  AuthStatus?: AuthStatusResolvers<ContextType>;
  ContactInfo?: ContactInfoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Location?: LocationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Occupation?: OccupationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SocialMedia?: SocialMediaResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
