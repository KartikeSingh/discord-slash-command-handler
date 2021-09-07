const Handler = require("./handler");
const Discord = require('discord.js');
const slashMessage = require('./slashMessage');
const SlashMessage = new slashMessage();

class commandData {
    /**
     * 
     * @param {Discord.Client} client Your discord client
     * @param {Discord.Guild} guild The guild where command was use
     * @param {Discord.TextChannel} channel The channel where command was used
     * @param {Discord.CommandInteraction | undefined} interaction The interaction of the slash command
     * @param {Array<String>} args The array of arguments
     * @param {Discord.GuildMember} member The guild member who used the command
     * @param {Handler} handler The command Handler
     * @param {Discord.Message | SlashMessage} message The message object in which command was used.
     * @param {Discord.User} user The command user.
     * @param {String | undefined} subCommand The sub command.
     * @param {String | undefined} subCommandGroup The sub command.
     */
    constructor(client, guild, channel, interaction, args, member, handler, message, user, subCommand, subCommandGroup) {
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.interaction = interaction;
        this.args = args;
        this.member = member;
        this.handler = handler;
        this.message = message;
        this.user = user;
        this.subCommandGroup = subCommandGroup;
        this.subCommand = subCommand;
    }
}

module.exports = commandData;