const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { APP_SECRET, getUserId } = require("../utils");

async function post(parent, args, context, info) {
    const { userId } = context;
    const newLink = await context.prisma.link.create({
        data: {
            url: args.url, description: args.description,
            postedBy: { connect: { id: userId }}
        }
    });
    context.pubsub.publish("NEW_LINK", newLink);
    return newLink;
}

async function updateLink(parent, args, context, info) {
    try {
        return await context.prisma.link.update({
            where: { id: Number(args.id) },
            data: { url: args.url, description: args.description }
        })
    } catch (e) {
        return null;
    }
}

async function deleteLink(parent, args, context, info) {
    try {
        return await context.prisma.link.delete({
            where: {id: Number(args.id) }
        });
    } catch (e) {
        return null;
    }
}

async function signup(parent, args, context, info) {
    let password = bcrypt.hashSync(args.password, 10);

    let user = null;
    try {
        user = await context.prisma.user.create({
            data: {
               ...args, password
            }
        });
    } catch (e) {
        if(e.code === "P2002")
            throw new Error("User with such email already exists");
        else
            throw new Error(e.message);
    }
   

    return {
        token: jwt.sign({ userId: user.id}, APP_SECRET),
        user
    };
}

async function login(parent, args, context, info) {
    let user = await context.prisma.user.findUnique({
        where: { email: args.email }
    });
    if(!user)
        throw new Error("No such user found");
    let passwordValid = bcrypt.compareSync(args.password, user.password);
    if(!passwordValid) 
        throw new Error("Password incorrect");

    return {
        token: jwt.sign({ userId: user.id}, APP_SECRET),
        user
    };
}

async function vote(parent, args, context, info) {
    const { userId } = context;
    let newVote = await context.prisma.vote.findUnique({
        where: { 
            linkId_userId: {
                linkId: Number(args.linkId),
                userId: userId
            }  
        }
    });

    if(Boolean(newVote))
        throw new Error(`You already voted for link: ${args.linkId}`);

   
    newVote = await context.prisma.vote.create({
        data: {
            link: { connect: { id: Number(args.linkId )}},
            user: { connect: { id: userId }}
        }
    });
    context.pubsub.publish("NEW_VOTE", newVote);
    
    return newVote;   
}

module.exports = {
    post, updateLink, deleteLink, signup, login, vote
};