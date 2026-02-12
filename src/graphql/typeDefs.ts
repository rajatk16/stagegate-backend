import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type Query {
    # User Queries

    # Get the current user's profile
    me: User

    # Auth Queries

    # Get the current user's authentication status
    authStatus: AuthStatus

    # Organization Queries

    # Get a list of organizations that the current user is a member of
    myOrganizations: [Organization!]!

    # Search organizations by name
    searchOrganizations(
      query: String!
      excludeMyOrganizations: Boolean = false
      limit: Int = 10
    ): [Organization!]!

    # Get a single organization by its slug
    organizationBySlug(slug: String!): Organization!

    # Event Queries

    # Get a list of events in an organization
    organizationEvents(organizationId: ID!): [Event!]!

    # Get a single event by its slug
    eventBySlug(organizationSlug: String!, eventSlug: String!): Event!
  }

  type Mutation {
    # User Mutations

    # Update the current user's profile
    updateUser(input: UpdateUserInput!): User!

    # Update the current user's profile picture URL
    updateProfilePicture(url: String!): User!

    # Delete the current user's profile picture
    deleteProfilePicture: User!

    # Auth Mutations

    # Sign up a new user
    signUp(input: SignUpInput!): AuthPayload!

    # Organization Mutations

    # Create a new organization
    createOrganization(input: CreateOrganizationInput!): Organization!

    # Join an organization
    joinOrganization(input: JoinOrganizationInput!): OrganizationMember!

    # Change the role of a user in an organization
    changeOrgMemberRole(input: ChangeOrgMemberRoleInput!): OrganizationMember!

    # Remove a user from an organization
    removeOrgMember(input: RemoveOrgMemberInput!): RemoveOrgMemberPayload!

    # Leave an organization
    leaveOrganization(input: LeaveOrganizationInput!): LeaveOrganizationPayload!

    # Update an organization
    updateOrganization(input: UpdateOrganizationInput!): Organization!

    # Event Mutations

    # Create a new event
    createEvent(input: CreateEventInput!): CreateEventPayload!

    # Update an event
    updateEvent(input: UpdateEventInput!): Event!
  }

  # User Type. Represents a user in the system.
  type User {
    # The unique identifier for the user
    id: ID!
    # The name of the user
    name: String!
    # The email of the user
    email: String!
    # The profile picture of the user
    profilePicture: String
    # The location of the user (city and country)
    location: Location
    # The bio of the user
    bio: String
    # The occupation of the user (company and title)
    occupation: Occupation
    # The contact information of the user (email, phone and website)
    contactInfo: ContactInfo
    # The social media accounts of the user
    socialMedia: [SocialMedia!]
    # The date and time the user was created
    createdAt: DateTime!
    # The date and time the user was last updated
    updatedAt: DateTime!
  }

  # Location Type. Represents a location in the system.
  type Location {
    # The city of the location
    city: String
    # The country of the location
    country: String
  }

  # Occupation Type. Represents an occupation in the system.
  type Occupation {
    # The company of the occupation
    company: String
    # The title of the occupation
    title: String
  }

  # Contact Info Type. Represents a contact information in the system.
  type ContactInfo {
    # The secondary email of the contact information
    secondaryEmail: String
    # The phone of the contact information
    phone: String
    # The website of the contact information
    website: String
  }

  # Social Media Type. Represents a social media account in the system.
  type SocialMedia {
    # The platform of the social media account
    platform: String!
    # The handle of the social media account
    handle: String!
  }

  # Auth Status Type. Represents an auth status in the system.
  type AuthStatus {
    # The unique identifier for the user
    uid: ID!
    # The email of the user
    email: String!
    # Whether the user's email is verified
    emailVerified: Boolean!
  }

  # Organization Type. Represents an organization in the system.
  type Organization {
    # The unique identifier for the organization
    id: ID!
    # The name of the organization
    name: String!
    # The slug of the organization
    slug: String!
    # The description of the organization
    description: String
    # The logo of the organization
    logo: String
    # The website of the organization
    website: String
    # The owner of the organization
    owner: User!
    # Members of the organization
    members(first: Int = 20, after: String): OrganizationMembers!
    # The date and time the organization was created
    createdAt: DateTime!
    # The date and time the organization was last updated
    updatedAt: DateTime!
    # The role of the current user in the organization
    viewerRole: OrganizationMemberRole
    # Boolean for whether the organization is public
    isPublic: Boolean!
  }

  # Represents pagination and result of list of organization members.
  type OrganizationMembers {
    # Pagination information
    pagination: Pagination
    # List of organization members
    results: [OrganizationMember!]!
  }

  # Object that represents a single organization member.
  type OrganizationMember {
    # The user that is a member of the organization
    user: User!
    # The role of the user in the organization
    role: OrganizationMemberRole!
    # The Organization that the user is a member of
    organization: Organization!
  }

  # Represents the role of a user in an organization.
  enum OrganizationMemberRole {
    # The user is a member of the organization
    MEMBER
    # The user is an admin of the organization
    ADMIN
    # The user is a owner of the organization
    OWNER
  }

  # Event Type. Represents an event in the system.
  type Event {
    # The unique identifier for the event
    id: ID!
    # The name of the event
    name: String!
    # The slug of the event
    slug: String!
    # Event Type
    eventType: EventType!
    # The description of the event
    description: String
    # The tagline of the event
    tagline: String
    # The start date of the event
    startDate: DateTime
    # The end date of the event
    endDate: DateTime
    # The location of the event
    location: EventLocation
    # The website of the event (default is the organization website)
    website: String
    # The cover image of the event
    coverImage: String
    # The parent organization of the event
    organization: Organization!
    # The format of the event
    format: EventFormat!
    # The members of the event
    members(first: Int = 20, after: String): EventMembers!
    # The status of the event
    status: EventStatus!
    # The role of the current user in the parent organization
    viewerOrgRole: OrganizationMemberRole
    # The role of the current user in the event
    viewerEventRole: EventMemberRole
    # The date and time the event was created
    createdAt: DateTime!
    # The date and time the event was last updated
    updatedAt: DateTime!
  }

  # The type of an event.
  enum EventType {
    # The event is a conference
    CONFERENCE
    # The event is a meetup
    MEETUP
    # The event is a workshop
    WORKSHOP
    # The event is a hackathon
    HACKATHON
    # The event is a webinar
    WEBINAR
    # The event is of other type
    OTHER
  }

  # The format of the event.
  enum EventFormat {
    # The event is in-person
    IN_PERSON
    # The event is online
    ONLINE
    # The event is hybrid
    HYBRID
  }

  # The location of the event.
  type EventLocation {
    # The name of the location
    name: String
    # The address of the location
    address: String
    # The city of the location
    city: String
    # The country of the location
    country: String
  }

  # Represents the pagination and results of list of event members.
  type EventMembers {
    # Pagination Information
    pagination: Pagination
    # List of event members
    results: [EventMember!]!
  }

  # Object that represents a single event member.
  type EventMember {
    # The user that is a member of the event
    user: User!
    # The role of the user in the event
    role: EventMemberRole!
    # The Event that the user is a member of
    event: Event!
  }

  # Represents the status of an event.
  enum EventStatus {
    # The event is draft
    DRAFT
    # The event is published
    PUBLISHED
    # The event is archived
    ARCHIVED
  }

  # Represents the role of a user in an event.
  enum EventMemberRole {
    # The user is an organizer of the event
    ORGANIZER
    # The user is a reviewer of the event
    REVIEWER
    # The user is a guest of the event
    GUEST
  }

  # Proposal Type. Represents a proposal in the system.
  type Proposal {
    # The unique identifier for the proposal
    id: ID!
    # The event that the proposal is for
    eventId: ID!
    # The organization that the proposal is for
    organizationId: ID!
    # The title of the proposal
    title: String!
    # The short description of the proposal
    abstract: String!
    # The full description of the proposal
    description: String
    # Talk duration in minutes
    duration: Int
    # The speaker of the proposal
    speaker: User!
    # The status of the proposal
    status: ProposalStatus!
    # The format of the proposal
    format: ProposalFormat!
    # The date and time the proposal was created
    createdAt: DateTime!
    # The date and time the proposal was last updated
    updatedAt: DateTime!
    # The time when the proposal was submitted
    submittedAt: DateTime
    # The role of the current user in the proposal
    viewerRole: ProposalViewerRole
  }

  # Represents the status of a proposal.
  enum ProposalStatus {
    # The proposal is a draft
    DRAFT
    # The proposal is submitted
    SUBMITTED
    # The proposal is accepted
    ACCEPTED
    # The proposal is rejected
    REJECTED
    # The proposal is withdrawn
    WITHDRAWN
  }

  # Represents the format of a proposal.
  enum ProposalFormat {
    # The proposal is a talk
    TALK
    # The proposal is a workshop
    WORKSHOP
    # The proposal is a panel
    PANEL
    # The proposal is a lightning talk
    LIGHTNING_TALK
    # The proposal is of other type
    OTHER
  }

  # Represents the role of a user in a proposal.
  enum ProposalViewerRole {
    # The user is the speaker of the proposal
    SPEAKER
    # The user is a reviewer of the proposal
    REVIEWER
    # The user is an organizer of the proposal's parent event
    ORGANIZER
  }

  # Contains information about the current page, when results are split into multiple pages.
  type Pagination {
    # The address of the next page, if one exists. If the current page is the last page, "cursor" is "null".
    cursor: String
    # The number of items in the current page.
    pageSize: Int
  }

  # Location Input Type. Represents a location input in the system.
  input LocationInput {
    # The city of the location
    city: String
    # The country of the location
    country: String
  }

  # Occupation Input Type. Represents an occupation input in the system.
  input OccupationInput {
    # The company of the occupation
    company: String
    # The title of the occupation
    title: String
  }

  # Contact Info Input Type. Represents a contact information input in the system.
  input ContactInfoInput {
    # The secondary email of the contact information
    secondaryEmail: String
    # The phone of the contact information
    phone: String
    # The website of the contact information
    website: String
  }

  # Social Media Input Type. Represents a social media account input in the system.
  input SocialMediaInput {
    # The platform of the social media account
    platform: String!
    # The handle of the social media account
    handle: String!
  }

  # Update User Input Type. Represents an update user input in the system.
  input UpdateUserInput {
    # The name of the user
    name: String
    # The location of the user
    location: LocationInput
    # The bio of the user
    bio: String
    # The occupation of the user
    occupation: OccupationInput
    # The contact information of the user
    contactInfo: ContactInfoInput
    # The social media accounts of the user
    socialMedia: [SocialMediaInput!]
  }

  input SignUpInput {
    # The email of the user
    email: String!
    # The password of the user
    password: String!
    # The name of the user
    name: String!
  }

  # Create Organization Input Type. Represents a create organization input in the system.
  input CreateOrganizationInput {
    # The name of the organization
    name: String!
    # The description of the organization
    description: String
    # The logo of the organization
    logo: String
    # The website of the organization
    website: String
    # Boolean for whether the organization is public
    isPublic: Boolean
  }

  # Join Organization Input Type. Represents a join organization input in the system.
  input JoinOrganizationInput {
    # The organization ID
    organizationId: ID!
  }

  # Change the role of a user in an organization input type.
  input ChangeOrgMemberRoleInput {
    # The organization ID
    organizationId: ID!
    # The user ID
    userId: ID!
    # The new role of the user
    role: OrganizationMemberRole!
  }

  # Remove a user from an organization input type.
  input RemoveOrgMemberInput {
    # The organization ID
    organizationId: ID!
    # The user ID
    userId: ID!
  }

  # Leave an organization input type.
  input LeaveOrganizationInput {
    # The organization ID
    organizationId: ID!
  }

  # Update an organization input type.
  input UpdateOrganizationInput {
    # The organization ID
    organizationId: ID!
    # The description of the organization
    description: String
    # The logo of the organization
    logo: String
    # The website of the organization
    website: String
    # Boolean for whether the organization is public
    isPublic: Boolean
  }

  # Create Event Input Type. Represents a create event input in the system.
  input CreateEventInput {
    # The ID of the organization
    organizationId: ID!
    # The name of the event
    name: String!
    # The type of the event.
    eventType: EventType!
    # The description of the event
    description: String
    # The tagline of the event
    tagline: String
    # The start date of the event
    startDate: DateTime
    # The end date of the event
    endDate: DateTime
    # The location of the event
    location: EventLocationInput
    # The website of the event
    website: String
    # The cover image of the event
    coverImage: String
    # The format of the event
    format: EventFormat!
  }

  # Event Location Input Type. Represents an event location input in the system.
  input EventLocationInput {
    # The name of the location
    name: String
    # The address of the location
    address: String
    # The city of the location
    city: String
    # The country of the location
    country: String
  }

  # Update Event Input Type. Represents an update event input in the system.
  input UpdateEventInput {
    # The ID of the organization
    organizationId: ID!
    # The ID of the event
    eventId: ID!
    # The type of the event
    eventType: EventType
    # The description of the event
    description: String
    # The tagline of the event
    tagline: String
    # The startDate of the event
    startDate: DateTime
    # The endDate of the event
    endDate: DateTime
    # The location of the event
    location: EventLocationInput
    # The website of the event
    website: String
    # The format of the event
    format: EventFormat
    # The status of the event
    status: EventStatus
    # The cover image of the event
    coverImage: String
  }

  # Auth Payload Type. Represents an auth payload in the system.
  type AuthPayload {
    # The unique identifier for the user
    uid: ID!
    # The email of the user
    email: String!
    # The user's profile
    user: User!
  }

  # Remove a user from an organization payload type.
  type RemoveOrgMemberPayload {
    # Whether the user was removed from the organization
    success: Boolean!
  }

  # Leave an organization payload type.
  type LeaveOrganizationPayload {
    # Whether the user left the organization
    success: Boolean!
  }

  # The payload type for creating an event.
  type CreateEventPayload {
    event: Event!
  }
`;
