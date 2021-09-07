const { Collection } = require("discord.js");


class slashMessage {
    constructor() {
        this.author; // The command User
        this.content; // The message content
        this.mentions = { // All the mentions
            channels: new Collection(),
            members: new Collection(),
            users: new Collection(),
            roles: new Collection(),
        }
        // And all properties for CommandInteraction
    }
}

module.exports = slashMessage;