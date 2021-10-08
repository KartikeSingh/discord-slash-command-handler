// @ts-nocheck

import { CommandInteraction, Collection, ContextMenuInteraction, Guild, GuildChannel, GuildMember, Interaction, Role, ThreadChannel, User } from 'discord.js';
import Client from './Client';

class Message {
    author: User;
    content: string;
    mentions: MessageMentions;
    constructor(client: Client, interaction: CommandInteraction | ContextMenuInteraction, guild: Guild) {
        const args = [], keys = Object.keys(interaction);

        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = interaction[keys[i]];
        }

        interaction.options.data?.forEach((v) => args.push(v.value))

        this.author = interaction.user;
        this.channel = interaction.channel;
        this.createdAt = interaction.createdAt
        this.createdTimestamp = interaction.createdTimestamp
        this.content = `/${interaction.commandName} ${args.join(" ")}`;
        this.mentions = {
            channels: new Collection(),
            members: new Collection(),
            users: new Collection(),
            roles: new Collection(),
        }

        args.forEach(v => {
            let member = guild?.members?.cache?.get(v);
            let user = client?.users?.cache?.get(v);
            let channel = guild?.channels?.cache?.get(v);
            let role = guild?.roles?.cache?.get(v);

            if (member) this.mentions.members.set(member.id, member)
            if (user) this.mentions.users.set(user.id, user)
            if (role) this.mentions.roles.set(role.id, role)
            if (channel) this.mentions.channels.set(channel.id, channel)
        });
    }
}

export default Message;

interface Message extends Interaction {
    author: User;
    content: string;
    mentions: MessageMentions;
}

interface MessageMentions {
    channels: Collection<string, GuildChannel | ThreadChannel>,
    members: Collection<string, GuildMember>,
    users: Collection<string, User>,
    roles: Collection<string, Role>,
}