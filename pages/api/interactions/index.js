import { InteractionType, InteractionResponseType, verifyKeyMiddleware } from "discord-interactions";
import { ADDRESS_COMMAND, HasGuildCommands, VERIFY_COMMAND } from "../../../lib/commands";
import prisma from "../../../lib/prisma";
import { DiscordRequest } from "../../../lib/utils";

HasGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID, [
    ADDRESS_COMMAND,
    VERIFY_COMMAND,
]);

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        req.header = (name) => req.headers[name.toLowerCase()];
        req.body = JSON.stringify(req.body);
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

async function getMemberAddress(memberId) {
    const result = await prisma.user.findFirst({
        where: { discord: memberId },
    });

    if (result) return result.address;
}

async function addVerifiedRole(memberId) {
    const endpoint = `guilds/${process.env.DISCORD_GUILD_ID}/members/${memberId}/roles/1080339213821681807`;
    return await DiscordRequest(endpoint, { method: 'PUT' });
}

export default async function handler(req, res) {
    await runMiddleware(req, res, verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY));

    const { type, id, data, member } = req.body;

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        console.log(data);
        const { name } = data;

        if (name === "address") {
            const address = await getMemberAddress(member.user.id);

            if (address) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `Your address is \`${address}\`!`,
                    },
                });
            }

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Sorry! You have no address synchronized with your account!",
                },
            });
        }

        if (name === "verify") {
            const address = await getMemberAddress(member.user.id);
            
            if (address) {
                const hasVerifiedRole = member.roles.find(r => r === "1080339213821681807") !== undefined;
                let content = "You are already verified!";

                if (!hasVerifiedRole) {
                    const res2 = await addVerifiedRole(member.user.id);
                    content = res2.ok
                        ? "Congratulations! You are now verified!"
                        : "Sorry! You have no address synchronized with your account!";
                }

                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: content
                    },
                });
            }

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Sorry! You have no address synchronized with your account! Access: https://localhost:3000/",
                },
            });
        }
    }
}