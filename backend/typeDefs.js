import { gql } from "apollo-server-express";
const typeDefs = gql`
  
  input PersonaInput {
    name: String!
    image: String
    quote: String
    description: String
    attitudes: String
    painPoints: String
    jobs: String
    activities: String
  }

  type User {
    id: ID!
    name:String!
    email: String!
    token: String
  }

  type Persona {
   id: ID!
    name: String!
    image: String
    quote: String
    description: String
    attitudes: String
    painPoints: String
    jobs: String
    activities: String
    lastModified:String
  }

  type PersonaCard{
    id: ID!
    name: String!
    image: String
    quote: String
    lastModified: String
  }

  type Query {
    personas: [Persona]
    persona(id:ID!):Persona
    currentUser(token: String!): User
  }

  type Mutation {
    createPersona(input:PersonaInput!): Persona
    signup(name:String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    updatePersona(id:ID!,input:PersonaInput!):Persona
    deletePersona(id:ID!):String
  }
  
  type Subscription{
    personaUpdated:Persona
  }
`;

export {typeDefs};