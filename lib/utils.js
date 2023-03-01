import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }
    }
}

export async function DiscordRequest(endpoint, options) {
    const url = 'https://discord.com/api/v10/' + endpoint;
    if (options.body) options.body = JSON.stringify(options.body);
    
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'DiscordBot (https://github.com/notkinash/discord-integration-dapp, 1.0.0)'
        },
        ...options
    });

    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }

    return res;
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}