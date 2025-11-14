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
  }

  type Mutation {
    # User Mutations

    # Update the current user's profile
    updateUser(input: UpdateUserInput!): User!

    # Update the current user's profile picture URL
    updateProfilePicture(url: String!): User!

    # Auth Mutations

    # Sign up a new user
    signUp(input: SignUpInput!): AuthPayload!
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
