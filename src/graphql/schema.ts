import { gql } from 'apollo-server';

export const typeDefs = gql`
    type User {
      id: Int!
      username: String!
      password: String!
      scores: [Score]!
    }
  
    type Score {
        id: Int!
        course: String! 
        score: Int!
        user_id: Int!
    }
  
    type Query {
      getUsers: [User!]!
      user(id: ID!): User!
      getScores: [Score!]!
      score(course: String!): Score!
    }

    input CreateUserInput{
      id: Int!
      username: String!
      password: String!
    }
    input UpdateUserNameInput{
      id: Int!
      newUserName: String!
    }
    type UpdateUserNameOutput {
      id: Int!
    }
    type Mutation {
      deleteUser(id: ID!): User
      createUser(input: CreateUserInput!): User
      updateUserName(input: UpdateUserNameInput!): UpdateUserNameOutput
    }
    `;
    
    
    // type UsersSuccessfulResult {
    //   users: [User!]!
    // }
    // type UsersErrorResult {
    //   message: String!
    // }

    // union UsersResult = UsersSuccessfulResult | UsersErrorResult