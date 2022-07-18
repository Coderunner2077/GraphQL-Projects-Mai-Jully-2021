const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const newLink = await prisma.link.create({
        data: {
            description: "Replaces traditional ORM",
            url: "www.prisma.io"
        }
    });
    //await prisma.link.update({ where: { id: 1}, data: { url: "www.google.com", description: "Google" }});
    const allLinks = await prisma.link.findMany();
}

main()
    .catch(e => { throw e })
    .finally(async () => {
        await prisma.$disconnect();
    })