function info(parent, args, context, info) {
    return "This is the API for the Hackernews clone"
}

async function feed(parent, args, context, info) {
    const where = args.filter ?
        {
            OR: [
                { url: { contains: args.filter} },
                { description: { contains: args.filter }}
            ]
        } : {};

    const count = await context.prisma.link.count({ where });
    
    const links = await context.prisma.link.findMany({ 
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy
    });
    
    return {
        count,
        links
    }
}

function link(parent, args, context, info) { 
    return context.prisma.link.findUnique({
        where: { id: Number(args.id) }
    });
}

function users(parent, ars, context, info) {
    return context.prisma.user.findMany();
}

module.exports = {
    info, feed, link, users
}