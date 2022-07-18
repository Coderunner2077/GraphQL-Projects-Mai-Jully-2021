import express from 'express';
import session from 'express-session';
import { v4 as uuidv4 }  from 'uuid';
import passport from 'passport';
import User from './User';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport';

const PORT = process.env.PORT || 4000;

const app = express();

const SESSION_SECRET = 'bad secret';

app.use(session({
    genid: (req) => uuidv4(), 
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false // for production env also need to use cookie: { secure: true } for cookies to be sent only via https
})); 
// also I used default in-memory store which means sessions deleted after each restart of server

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const users = User.getUsers();
    const matchingUser = users.find(user => id === user.id);
    done(null, matchingUser);
});

passport.use(
    new GraphQLLocalStrategy((email, password, done) => {
        const users = User.getUsers();
        const matchingUser = users.find(user => user.email === email && user.password === password);
        const error = matchingUser ? null : new Error("email and/or password incorrect");
        done(error, matchingUser);
    })
)

// after setting express-session middleware I initialize Passport by calling passport.initialize()
app.use(passport.initialize());

// I connect Passport and express-session by adding the passport.session() middleware
app.use(passport.session());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res}) => buildContext({ req, res, User }),
    playground: {
        settings: {
            "request.credentials": "same-origin"
        }
    }
});

server.start()
    .then(() => server.applyMiddleware({ app }));

app.listen({ port: PORT}, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});