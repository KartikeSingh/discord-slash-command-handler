const Discord = require('discord.js');

module.exports = (client, interaction, guild) => {
    const args = [];

    interaction.options._hoistedOptions?.forEach((v) => args.push(v.value))

    interaction.author = interaction.user;
    interaction.content = `/${interaction.commandName} ${args.join(" ")}`;
    interaction.mentions = {
        channels: new Discord.Collection(),
        members: new Discord.Collection(),
        users: new Discord.Collection(),
        roles: new Discord.Collection(),
    }

    interaction.reply = interaction.followUp;

    args.forEach(v => {
        let member = guild.members.cache.get(v);
        let user = client.users.cache.get(v);
        let channel = guild.members.cache.get(v);
        let role = guild.members.cache.get(v);

        if (member) interaction.mentions.members.set(member.id, member)
        if (user) interaction.mentions.users.set(user.id, user)
        if (role) interaction.mentions.roles.set(role.id, role)
        if (channel) interaction.mentions.channels.set(channel.id, channel)
    });

    return interaction;
}