const Handler = require("./handler");

class commandData {
    /**
     * 
     * @param {*} client Your discord client
     * @param {*} guild The guild where command was use
     * @param {*} channel The channel where command was used
     * @param {*} interaction The interaction of the slash command
     * @param {Array<String>} args The array of arguments
     * @param {*} member The guild member who used the command
     * @param {Handler} handler The command Handler
     */
    constructor(client, guild, channel, interaction, args, member, handler) {
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.interaction = interaction;
        this.args = args;
        this.member = member;
        this.handler = handler;
    }
}

module.exports = commandData;