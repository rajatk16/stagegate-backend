import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    location: Location
    bio: String
    occupation: Occupation
    contactInfo: ContactInfo
    socialMedia: SocialMedia
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
    platform: String
    handle: String
  }
`;
