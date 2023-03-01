import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
    if (req.method === "GET") {
        const user = await prisma.user.findFirst({
            where: { id: parseInt(req.query.id) }
        });
    
        return res.status(201).json(user);
    }
}