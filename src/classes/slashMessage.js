class slashMessage {
    constructor(options) {
        const { member, author, client, guild, channel, interaction, content, createdAt } = options;

        this.member = member;
        this.author = author;
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.interaction = interaction;
        this.content = content;
        this.createdAt = createdAt;
    }
}

module.exports = slashMessage;