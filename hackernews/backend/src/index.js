const { ApolloServer, PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");
const Feed = require("./resolvers/Feed");

const prisma = new PrismaClient();
const pubsub = new PubSub();  

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, "schema.graphql"),
        "utf8"
    ),   
    resolvers: { Query, Mutation, Link, User, Subscription, Vote, Feed},     
    context: ({ req }) => ({
        ...req,
        prisma,
        pubsub,
        userId: req && req.headers.authorization ?
            getUserId(req) :
            null
    })
});

server
    .listen()
    .then(({ url }) => 
        console.log(`Apollo Server is running on ${url}`)
    );
