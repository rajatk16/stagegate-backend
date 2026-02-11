import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import {
  OrganizationModel,
  OrganizationMemberModel,
  EventModel,
  EventMemberModel,
} from './models';
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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type ChangeOrgMemberRoleInput = {
  organizationId: Scalars['ID']['input'];
  role: OrganizationMemberRole;
  userId: Scalars['ID']['input'];
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

export type CreateEventInput = {
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  eventType: EventType;
  format: EventFormat;
  location?: InputMaybe<EventLocationInput>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventPayload = {
  __typename?: 'CreateEventPayload';
  event: Event;
};

export type CreateOrganizationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

export type Event = {
  __typename?: 'Event';
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  eventType: EventType;
  format: EventFormat;
  id: Scalars['ID']['output'];
  location?: Maybe<EventLocation>;
  members: EventMembers;
  name: Scalars['String']['output'];
  organization: Organization;
  slug: Scalars['String']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  status: EventStatus;
  tagline?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  viewerEventRole?: Maybe<EventMemberRole>;
  viewerOrgRole?: Maybe<OrganizationMemberRole>;
  website?: Maybe<Scalars['String']['output']>;
};

export type EventMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export enum EventFormat {
  Hybrid = 'HYBRID',
  InPerson = 'IN_PERSON',
  Online = 'ONLINE',
}

export type EventLocation = {
  __typename?: 'EventLocation';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type EventLocationInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type EventMember = {
  __typename?: 'EventMember';
  event: Event;
  role: EventMemberRole;
  user: User;
};

export enum EventMemberRole {
  Guest = 'GUEST',
  Organizer = 'ORGANIZER',
  Reviewer = 'REVIEWER',
}

export type EventMembers = {
  __typename?: 'EventMembers';
  pagination?: Maybe<Pagination>;
  results: Array<EventMember>;
};

export enum EventStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
}

export enum EventType {
  Conference = 'CONFERENCE',
  Hackathon = 'HACKATHON',
  Meetup = 'MEETUP',
  Other = 'OTHER',
  Webinar = 'WEBINAR',
  Workshop = 'WORKSHOP',
}

export type JoinOrganizationInput = {
  organizationId: Scalars['ID']['input'];
};

export type LeaveOrganizationInput = {
  organizationId: Scalars['ID']['input'];
};

export type LeaveOrganizationPayload = {
  __typename?: 'LeaveOrganizationPayload';
  success: Scalars['Boolean']['output'];
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
  changeOrgMemberRole: OrganizationMember;
  createEvent: CreateEventPayload;
  createOrganization: Organization;
  deleteProfilePicture: User;
  joinOrganization: OrganizationMember;
  leaveOrganization: LeaveOrganizationPayload;
  removeOrgMember: RemoveOrgMemberPayload;
  signUp: AuthPayload;
  updateEvent: Event;
  updateOrganization: Organization;
  updateProfilePicture: User;
  updateUser: User;
};

export type MutationChangeOrgMemberRoleArgs = {
  input: ChangeOrgMemberRoleInput;
};

export type MutationCreateEventArgs = {
  input: CreateEventInput;
};

export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput;
};

export type MutationJoinOrganizationArgs = {
  input: JoinOrganizationInput;
};

export type MutationLeaveOrganizationArgs = {
  input: LeaveOrganizationInput;
};

export type MutationRemoveOrgMemberArgs = {
  input: RemoveOrgMemberInput;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};

export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput;
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

export type Organization = {
  __typename?: 'Organization';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  members: OrganizationMembers;
  name: Scalars['String']['output'];
  owner: User;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewerRole?: Maybe<OrganizationMemberRole>;
  website?: Maybe<Scalars['String']['output']>;
};

export type OrganizationMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type OrganizationMember = {
  __typename?: 'OrganizationMember';
  organization: Organization;
  role: OrganizationMemberRole;
  user: User;
};

export enum OrganizationMemberRole {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export type OrganizationMembers = {
  __typename?: 'OrganizationMembers';
  pagination?: Maybe<Pagination>;
  results: Array<OrganizationMember>;
};

export type Pagination = {
  __typename?: 'Pagination';
  cursor?: Maybe<Scalars['String']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
};

export type Proposal = {
  __typename?: 'Proposal';
  abstract?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  eventId: Scalars['ID']['output'];
  format: ProposalFormat;
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  speaker: User;
  status: ProposalStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum ProposalFormat {
  LightningTalk = 'LIGHTNING_TALK',
  Other = 'OTHER',
  Panel = 'PANEL',
  Talk = 'TALK',
  Workshop = 'WORKSHOP',
}

export enum ProposalStatus {
  Accepted = 'ACCEPTED',
  Draft = 'DRAFT',
  Rejected = 'REJECTED',
  Submitted = 'SUBMITTED',
  Withdrawn = 'WITHDRAWN',
}

export type Query = {
  __typename?: 'Query';
  authStatus?: Maybe<AuthStatus>;
  eventBySlug: Event;
  me?: Maybe<User>;
  myOrganizations: Array<Organization>;
  organizationBySlug: Organization;
  organizationEvents: Array<Event>;
  searchOrganizations: Array<Organization>;
};

export type QueryEventBySlugArgs = {
  eventSlug: Scalars['String']['input'];
  organizationSlug: Scalars['String']['input'];
};

export type QueryOrganizationBySlugArgs = {
  slug: Scalars['String']['input'];
};

export type QueryOrganizationEventsArgs = {
  organizationId: Scalars['ID']['input'];
};

export type QuerySearchOrganizationsArgs = {
  excludeMyOrganizations?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

export type RemoveOrgMemberInput = {
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type RemoveOrgMemberPayload = {
  __typename?: 'RemoveOrgMemberPayload';
  success: Scalars['Boolean']['output'];
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

export type UpdateEventInput = {
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  eventId: Scalars['ID']['input'];
  eventType?: InputMaybe<EventType>;
  format?: InputMaybe<EventFormat>;
  location?: InputMaybe<EventLocationInput>;
  organizationId: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<EventStatus>;
  tagline?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['ID']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
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
  ChangeOrgMemberRoleInput: ChangeOrgMemberRoleInput;
  ContactInfo: ResolverTypeWrapper<ContactInfo>;
  ContactInfoInput: ContactInfoInput;
  CreateEventInput: CreateEventInput;
  CreateEventPayload: ResolverTypeWrapper<
    Omit<CreateEventPayload, 'event'> & { event: ResolversTypes['Event'] }
  >;
  CreateOrganizationInput: CreateOrganizationInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Event: ResolverTypeWrapper<EventModel>;
  EventFormat: EventFormat;
  EventLocation: ResolverTypeWrapper<EventLocation>;
  EventLocationInput: EventLocationInput;
  EventMember: ResolverTypeWrapper<EventMemberModel>;
  EventMemberRole: EventMemberRole;
  EventMembers: ResolverTypeWrapper<
    Omit<EventMembers, 'results'> & { results: Array<ResolversTypes['EventMember']> }
  >;
  EventStatus: EventStatus;
  EventType: EventType;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JoinOrganizationInput: JoinOrganizationInput;
  LeaveOrganizationInput: LeaveOrganizationInput;
  LeaveOrganizationPayload: ResolverTypeWrapper<LeaveOrganizationPayload>;
  Location: ResolverTypeWrapper<Location>;
  LocationInput: LocationInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Occupation: ResolverTypeWrapper<Occupation>;
  OccupationInput: OccupationInput;
  Organization: ResolverTypeWrapper<OrganizationModel>;
  OrganizationMember: ResolverTypeWrapper<OrganizationMemberModel>;
  OrganizationMemberRole: OrganizationMemberRole;
  OrganizationMembers: ResolverTypeWrapper<
    Omit<OrganizationMembers, 'results'> & {
      results: Array<ResolversTypes['OrganizationMember']>;
    }
  >;
  Pagination: ResolverTypeWrapper<Pagination>;
  Proposal: ResolverTypeWrapper<Proposal>;
  ProposalFormat: ProposalFormat;
  ProposalStatus: ProposalStatus;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RemoveOrgMemberInput: RemoveOrgMemberInput;
  RemoveOrgMemberPayload: ResolverTypeWrapper<RemoveOrgMemberPayload>;
  SignUpInput: SignUpInput;
  SocialMedia: ResolverTypeWrapper<SocialMedia>;
  SocialMediaInput: SocialMediaInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateEventInput: UpdateEventInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthPayload: AuthPayload;
  AuthStatus: AuthStatus;
  Boolean: Scalars['Boolean']['output'];
  ChangeOrgMemberRoleInput: ChangeOrgMemberRoleInput;
  ContactInfo: ContactInfo;
  ContactInfoInput: ContactInfoInput;
  CreateEventInput: CreateEventInput;
  CreateEventPayload: Omit<CreateEventPayload, 'event'> & {
    event: ResolversParentTypes['Event'];
  };
  CreateOrganizationInput: CreateOrganizationInput;
  DateTime: Scalars['DateTime']['output'];
  Event: EventModel;
  EventLocation: EventLocation;
  EventLocationInput: EventLocationInput;
  EventMember: EventMemberModel;
  EventMembers: Omit<EventMembers, 'results'> & {
    results: Array<ResolversParentTypes['EventMember']>;
  };
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JoinOrganizationInput: JoinOrganizationInput;
  LeaveOrganizationInput: LeaveOrganizationInput;
  LeaveOrganizationPayload: LeaveOrganizationPayload;
  Location: Location;
  LocationInput: LocationInput;
  Mutation: Record<PropertyKey, never>;
  Occupation: Occupation;
  OccupationInput: OccupationInput;
  Organization: OrganizationModel;
  OrganizationMember: OrganizationMemberModel;
  OrganizationMembers: Omit<OrganizationMembers, 'results'> & {
    results: Array<ResolversParentTypes['OrganizationMember']>;
  };
  Pagination: Pagination;
  Proposal: Proposal;
  Query: Record<PropertyKey, never>;
  RemoveOrgMemberInput: RemoveOrgMemberInput;
  RemoveOrgMemberPayload: RemoveOrgMemberPayload;
  SignUpInput: SignUpInput;
  SocialMedia: SocialMedia;
  SocialMediaInput: SocialMediaInput;
  String: Scalars['String']['output'];
  UpdateEventInput: UpdateEventInput;
  UpdateOrganizationInput: UpdateOrganizationInput;
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

export type CreateEventPayloadResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['CreateEventPayload'] = ResolversParentTypes['CreateEventPayload'],
> = {
  event?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EventResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event'],
> = {
  coverImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  eventType?: Resolver<ResolversTypes['EventType'], ParentType, ContextType>;
  format?: Resolver<ResolversTypes['EventFormat'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['EventLocation']>, ParentType, ContextType>;
  members?: Resolver<
    ResolversTypes['EventMembers'],
    ParentType,
    ContextType,
    RequireFields<EventMembersArgs, 'first'>
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EventStatus'], ParentType, ContextType>;
  tagline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  viewerEventRole?: Resolver<Maybe<ResolversTypes['EventMemberRole']>, ParentType, ContextType>;
  viewerOrgRole?: Resolver<
    Maybe<ResolversTypes['OrganizationMemberRole']>,
    ParentType,
    ContextType
  >;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type EventLocationResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['EventLocation'] = ResolversParentTypes['EventLocation'],
> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type EventMemberResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['EventMember'] = ResolversParentTypes['EventMember'],
> = {
  event?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['EventMemberRole'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type EventMembersResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['EventMembers'] = ResolversParentTypes['EventMembers'],
> = {
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['EventMember']>, ParentType, ContextType>;
};

export type LeaveOrganizationPayloadResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['LeaveOrganizationPayload'] = ResolversParentTypes['LeaveOrganizationPayload'],
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

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
  changeOrgMemberRole?: Resolver<
    ResolversTypes['OrganizationMember'],
    ParentType,
    ContextType,
    RequireFields<MutationChangeOrgMemberRoleArgs, 'input'>
  >;
  createEvent?: Resolver<
    ResolversTypes['CreateEventPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateEventArgs, 'input'>
  >;
  createOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateOrganizationArgs, 'input'>
  >;
  deleteProfilePicture?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  joinOrganization?: Resolver<
    ResolversTypes['OrganizationMember'],
    ParentType,
    ContextType,
    RequireFields<MutationJoinOrganizationArgs, 'input'>
  >;
  leaveOrganization?: Resolver<
    ResolversTypes['LeaveOrganizationPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationLeaveOrganizationArgs, 'input'>
  >;
  removeOrgMember?: Resolver<
    ResolversTypes['RemoveOrgMemberPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveOrgMemberArgs, 'input'>
  >;
  signUp?: Resolver<
    ResolversTypes['AuthPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, 'input'>
  >;
  updateEvent?: Resolver<
    ResolversTypes['Event'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateEventArgs, 'input'>
  >;
  updateOrganization?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOrganizationArgs, 'input'>
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

export type OrganizationResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['Organization'] = ResolversParentTypes['Organization'],
> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  members?: Resolver<
    ResolversTypes['OrganizationMembers'],
    ParentType,
    ContextType,
    RequireFields<OrganizationMembersArgs, 'first'>
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  viewerRole?: Resolver<
    Maybe<ResolversTypes['OrganizationMemberRole']>,
    ParentType,
    ContextType
  >;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type OrganizationMemberResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['OrganizationMember'] = ResolversParentTypes['OrganizationMember'],
> = {
  organization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['OrganizationMemberRole'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type OrganizationMembersResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['OrganizationMembers'] = ResolversParentTypes['OrganizationMembers'],
> = {
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['OrganizationMember']>, ParentType, ContextType>;
};

export type PaginationResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination'],
> = {
  cursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pageSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type ProposalResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Proposal'] = ResolversParentTypes['Proposal'],
> = {
  abstract?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  eventId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  format?: Resolver<ResolversTypes['ProposalFormat'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  speaker?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProposalStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = DataSourceContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  authStatus?: Resolver<Maybe<ResolversTypes['AuthStatus']>, ParentType, ContextType>;
  eventBySlug?: Resolver<
    ResolversTypes['Event'],
    ParentType,
    ContextType,
    RequireFields<QueryEventBySlugArgs, 'eventSlug' | 'organizationSlug'>
  >;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  myOrganizations?: Resolver<Array<ResolversTypes['Organization']>, ParentType, ContextType>;
  organizationBySlug?: Resolver<
    ResolversTypes['Organization'],
    ParentType,
    ContextType,
    RequireFields<QueryOrganizationBySlugArgs, 'slug'>
  >;
  organizationEvents?: Resolver<
    Array<ResolversTypes['Event']>,
    ParentType,
    ContextType,
    RequireFields<QueryOrganizationEventsArgs, 'organizationId'>
  >;
  searchOrganizations?: Resolver<
    Array<ResolversTypes['Organization']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchOrganizationsArgs, 'excludeMyOrganizations' | 'limit' | 'query'>
  >;
};

export type RemoveOrgMemberPayloadResolvers<
  ContextType = DataSourceContext,
  ParentType extends
    ResolversParentTypes['RemoveOrgMemberPayload'] = ResolversParentTypes['RemoveOrgMemberPayload'],
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  CreateEventPayload?: CreateEventPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Event?: EventResolvers<ContextType>;
  EventLocation?: EventLocationResolvers<ContextType>;
  EventMember?: EventMemberResolvers<ContextType>;
  EventMembers?: EventMembersResolvers<ContextType>;
  LeaveOrganizationPayload?: LeaveOrganizationPayloadResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Occupation?: OccupationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  OrganizationMember?: OrganizationMemberResolvers<ContextType>;
  OrganizationMembers?: OrganizationMembersResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  Proposal?: ProposalResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RemoveOrgMemberPayload?: RemoveOrgMemberPayloadResolvers<ContextType>;
  SocialMedia?: SocialMediaResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
