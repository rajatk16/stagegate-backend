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

  # Auth Payload Type. Represents an auth payload in the system.
  type AuthPayload {
    # The unique identifier for the user
    uid: ID!
    # The email of the user
    email: String!
    # The user's profile
    user: User!
  }
`;
