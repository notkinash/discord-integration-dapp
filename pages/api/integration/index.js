import prisma from "../../../lib/prisma";
import { verifyMessage } from "ethers/lib/utils";
import { hashMessage } from "ethers/lib/utils";

export default async function handle(req, res) {
    const { discord, address, signature } = req.body;
    const recoveredAddress = verifyMessage(discord, signature);
    if (recoveredAddress === address) {
        const result1 = await prisma.user.findFirst({
            where: {
                discord: discord,
            },
        });

        if (result1) {
            await prisma.user.deleteMany({
                where: {
                    discord: discord,
                },
            });
        }

        const result = await prisma.user.create({
            data: {
                discord: discord,
                address: address,
            },
        });
        return res.status(201).json(result);
    }
}