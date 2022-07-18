import { v4 as uuidv4 } from "uuid";

const resolvers = {
    Query: {
        currentUser: (parent, args, context) =>  {
            console.log(context.getUser());
            return context.getUser();
        }
    },
    Mutation: {
        logout: (parent, args, context) => context.logout(),
        login: async (parent, { email, password }, context) => {
            console.log(context.getUser());
            const { user } = await context.authenticate("graphql-local", { email, password});
            await context.login(user); // to create persistent user session Passport requires login() call after authenticating
            console.log(context.getUser());
            return { user };
        },
        signup: async (parent, { name, email, password }, context) => {
            const existingUsers = context.User.getUsers();
            const userWithEmailExists = !!existingUsers.find(user => user.email === email);
            if(userWithEmailExists)
                throw new Error("User with the provided email already exists");

            const newUser = { 
                id: uuidv4(),
                name,
                email,
                password
            };

            context.User.addUser(newUser);
            
            await context.login(newUser);
            return { user: newUser }
        }
    }
};

export default resolvers;