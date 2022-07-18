import { gql } from "apollo-server-express";

const typeDefs = gql`
    type User {
        id: ID
        firstName: String
        lastName: String
        email: String
    }

    type Query {
        currentUser: User
    }

    type Mutation {
        logout: Boolean
        login(email: String!, password: String!): AuthLoad
        signup(name: String!, email: String!, password: String!): AuthLoad
    }

    type AuthLoad {
        user: User
    }
`;

export default typeDefs;