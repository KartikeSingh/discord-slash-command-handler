import { Collection } from 'discord.js';

export default <tp>(interaction: any): tp => {
    const args = [];
    const guild = interaction.guild, client = interaction.client

    interaction.options.data?.forEach((v) => args.push(v.value))

    interaction.author = interaction.user;
    interaction.content = `/${interaction.commandName} ${args.join(" ")}`;
    interaction.mentions = {
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

        if (member) interaction.mentions.members.set(member.id, member)
        if (user) interaction.mentions.users.set(user.id, user)
        if (role) interaction.mentions.roles.set(role.id, role)
        if (channel) interaction.mentions.channels.set(channel.id, channel)
    });

    return interaction;
}