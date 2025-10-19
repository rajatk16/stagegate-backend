import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type Query {
    me: User
  }

  type Mutation {
    updateUser(input: UpdateUserInput!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    location: Location
    bio: String
    occupation: Occupation
    contactInfo: ContactInfo
    socialMedia: [SocialMedia!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Location {
    city: String
    country: String
  }

  type Occupation {
    company: String
    title: String
  }

  type ContactInfo {
    email: String
    phone: String
    website: String
  }

  type SocialMedia {
    platform: String!
    handle: String!
  }

  input LocationInput {
    city: String
    country: String
  }

  input OccupationInput {
    company: String
    title: String
  }

  input ContactInfoInput {
    email: String
    phone: String
    website: String
  }

  input SocialMediaInput {
    platform: String!
    handle: String!
  }

  input UpdateUserInput {
    name: String
    location: LocationInput
    bio: String
    occupation: OccupationInput
    contactInfo: ContactInfoInput
    socialMedia: [SocialMediaInput!]
  }
`;
