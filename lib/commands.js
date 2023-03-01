import { capitalize, DiscordRequest } from './utils';

export async function HasGuildCommands(appId, guildId, commands) {
    if (guildId === '' || appId === '') return;
    commands.forEach((command) => HasGuildCommand(appId, guildId, command));
}

async function HasGuildCommand(appId, guildId, command) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    try {
        const res = await DiscordRequest(endpoint, { method: 'GET' });
        const data = await res.json();

        if (data) {
            const installedNames = data.map((c) => c['name']);
            if (!installedNames.includes(command['name'])) {
                console.log(`Installing Discord Command "${command['name']}"`);
                InstallGuildCommand(appId, guildId, command);
            } else {
                console.log(`"${command['name']}" command already installed`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

export async function InstallGuildCommand(appId, guildId, command) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    try {
        const res = await DiscordRequest(endpoint, { method: 'POST', body: command });
    } catch (err) {
        console.error(err);
    }
}

export const ADDRESS_COMMAND = {
    name: 'address',
    description: 'Get your wallet address',
    type: 1
};

export const VERIFY_COMMAND = {
    name: 'verify',
    description: 'Verify yourself (must have a wallet address synchronized)',
    type: 1
}