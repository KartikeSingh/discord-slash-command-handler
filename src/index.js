const EventEmitter = require('./classes/eventEmitter');
const fs = require('fs');
const ms = require('ms');

const _options = {
    permissionReply: "You don't have enough permissions to use this command",
    timeoutMessage: "You are on a timeout",
    errorReply: "Unable to run this command due to errors",
    notOwnerReply: "Only bot owner's can use this command",
    prefix: "",
    slashGuilds: ["", ""],
    owners: ["", ""],
    handleSlash: true,
    handleNormal: false,
    timeouts: true,
    handleTimeout: true,
}

const { getOptions, getType } = require('./utility');

class commandHandler extends EventEmitter {
    /**
     * Discord slash command handler ( normal commands also works )
     * @param {Client} client Provide your discord client
     * @param {String} commandFolder path to the folder which includes your command files
     * @param {Array<String>} guilds the array which includes the guild where you want to add the slash commands
     * @param {_options} options the handler's options
     */
    constructor(client, commandFolder, options = _options) {
        super();
        if (!client || !client.ws.intents) throw new Error("Invalid client was provided, discord.js V 13, V11 are not supported");

        this.client = client;

        const { path } = require.main;

        this.commandFolder = `${path}/${commandFolder}`;

        if (!fs.existsSync(this.commandFolder)) throw new Error("Invalid command folder, please provide an correct folder");

        this.options = options;
        this.client.commands = new Map();
        this.client.commandAliases = new Map();
        this.timeouts = new Map();

        this.#setCommands().then(() => {
            this.emit("commandsCreated", this.client.commands, this.client.commandAliases);

            if (this.options.handleSlash === "both" || this.options.handleSlash === true) this.#handleSlashCommands();
            if (this.options.handleNormal === true || this.options.handleNormal === "both") {
                if (!this.options.prefix) throw new Error("Please provide a prefix, if you want us to handle Normal Commands");
                this.#handleNormalCommands();
            }
        })
    }

    async #setCommands() {
        return new Promise(async (resolve, reject) => {
            try {
                const commands = fs.readdirSync(this.commandFolder)?.filter(file => file.endsWith(".js"));

                if (commands?.length < 1) reject("no commands");

                let _commands = 0, _slashCommands = 0, _normalCommands = 0;

                for (let i = 0; i < commands.length; i++) {
                    const command = require(`${this.commandFolder}/${commands[i]}`);

                    if (!command.name || !command.run) continue;

                    this.client.commands.set(command.name, command);
                    command.name = command.name.replace(/ /g, "-").toLowerCase();
                    command.aliases?.forEach((v) => this.commandAliases.set(v, command.name));

                    _commands++;

                    if (command.slash !== true) _normalCommands++;

                    if (command.slash === true || command.slash === "both") {

                        if (!command.description) throw new Error("Description is required in a command\n Description was not found in " + command.name)

                        if ((!command.options || command.options.length === 0) && command.args) {
                            command.options = getOptions(command.args, command.argsDescription, command.argsType);
                        } else {
                            for (let i = 0; i < command.options?.length; i++) {
                                command.options[i].type = getType(command.options[i].type);
                            }
                        }

                        const command_data = {
                            name: command.name,
                            description: command.description,
                            options: command.options || [],
                        }

                        const app = this.client.api.applications(this.client.user.id);

                        if (this.slashGuilds?.length > 0 && command.global !== true) {
                            app.guilds(this.slashGuilds);
                        }

                        app.commands.post({
                            data: command_data,
                        })

                        _slashCommands++;
                    }
                }

                console.log(`[Discord-Slash-Command-Handler] : Added ${_commands} Commands, out of which ${_slashCommands} are slash commands and ${_normalCommands} are normal commands\n\nGuild Slash commands will start working in ${this.options.slashGuilds.length} minutes or less\nGlobal Slash commands will start working after 1 hour`);
                resolve("done")
            } catch (e) {
                reject(e);
            }
        })
    }

    async #handleSlashCommands() {

        this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
            let command;
            try {

                command = this.client.commands.get(interaction.data.name);

                if (!command) return;

                if (command.ownerOnly && !this.options.owners?.includes(interaction.member.user.id)) return this.#replyToInteraction(interaction, this.options.notOwnerReply || _options.notOwnerReply);

                if (this.timeouts.get(`${interaction.member.user.id}_${interaction.data.name}`)) return this.#replyToInteraction(interaction, this.options.timeoutMessage || options.timeoutMessage);

                const args = [], guild = this.client.guilds.cache.get(interaction.guild_id), channel = this.client.channels.cache.get(interaction.channel_id);
                interaction.data?.options?.forEach((v) => args.push(v.value))

                const message = {
                    member: interaction.member,
                    author: interaction.member.user,
                    client: this.client,
                    guild: guild,
                    channel: channel,
                    interaction: interaction,
                    content: `/${interaction.data.name} ${args.join(" ")}`,
                    member: interaction.member,
                };

                const command_data = {
                    client: this.client,
                    guild: guild,
                    channel: channel,
                    interaction: interaction,
                    args: args,
                    member: interaction.member,
                    message: message,
                }

                let allow = command.permissions ? command.permissions.length === 0 : true;

                command.permissions?.forEach((v) => { if (interaction.member.permissions.has(v)) allow = true });

                if (!allow) {
                    if (typeof (command.errors) === "function") {
                        command.errors("noPermissions", command, message);
                    } else {
                        await this.#replyToInteraction(interaction, this.options.permissionReply || _options.permissionReply);
                    }
                    return;
                }

                await this.#replyToInteraction(interaction, "command accepted");

                const timeout = (isNaN(command.timeout) && command.timeout) ? ms(command.timeout || " ") : command.timeout || (isNaN(command.cooldown) && command.cooldown) ? ms(command.cooldown || " ") : command.cooldown;

                if (timeout && this.options.timeouts === true) {
                    this.timeouts.set(`${interaction.member.user.id}_${interaction.data.name}`);
                    setTimeout(() => this.timeouts.delete(`${interaction.member.user.id}_${interaction.data.name}`), timeout)
                }

                if (this.options.handleSlash === true) command.run(command_data);
                else this.emit("slashCommand", command, command_data);
            } catch (e) {
                if (typeof (command.errors) === "function") {
                    command.errors("exception", command, message, e);
                    this.emit("exception", command, message, e);
                } else {
                    await this.#replyToInteraction(interaction, this.options.errorReply || _options.errorReply);
                }
            }
        })
    }

    async #handleNormalCommands() {
        this.client.on('message', async (message) => {
            let command;
            try {
                if (message.author.bot || !message.content.toLowerCase().startsWith(this.options.prefix)) return;

                const args = message.content.slice(this.options.prefix.length).trim().split(/ +/g);
                let cmd = args.shift().toLowerCase();

                if (cmd.length == 0) return;

                command = this.client.commands.get(cmd) || this.client.commands.get(this.client.commandAliases.get(cmd));

                if (!command || command.slash === true) return;

                if (command.dm !== true && !message.guild) return;

                if (this.timeouts.has(`${message.member.user.id}_${command.name}`)) {
                    if (this.options.handleTimeout !== false) message.reply(this.options.timeoutMessage || _options.timeoutMessage);
                    this.emit("timeout", command, message)
                    if (typeof (command.errors) === "function") command.errors("timeout", command, message)
                    return;
                }

                const reqArgs = getOptions(command, args).filter((v) => v.required === true) || [];

                if (args.length < reqArgs.length) {
                    if (typeof (command.errors) === "function") {
                        command.errors("lessArguments", command, message)
                        this.emit("lessArguments", command, message)
                    } else {
                        message.reply(`Invalid Syntax corrected syntax is : \`${this.options.prefix}${command.name} ${command.args}\``);
                        this.emit("lessArguments", command, message)
                    }
                    return;
                }

                let allow = command.permissions ? command.permissions.length === 0 : true;

                command.permissions?.forEach((v) => { if (message.member.permissions.has(v)) allow = true });

                if (!allow) {
                    if (typeof (command.errors) === "function") {
                        command.errors("noPermission", command, message);
                        this.emit("noPermission", command, message)
                    } else {
                        message.reply(this.options.permissionReply || _options.permissionReply);
                        this.emit("noPermission", command, message)
                    }
                    return;
                }

                const command_data = {
                    client: this.client,
                    guild: message.guild,
                    channel: message.channel,
                    interaction: undefined,
                    args: args,
                    member: message.member,
                    message: message,
                }

                let timeout;

                if (command.timeout || command.cooldown) {
                    if (typeof (command.timeout || command.cooldown) === "string") timeout = ms(command.timeout || command.cooldown)
                    else timeout = command.timeout || command.cooldown;
                }

                if (timeout && this.options.timeouts === true) {
                    this.timeouts.set(`${message.member.user.id}_${command.name}`);
                    setTimeout(() => this.timeouts.delete(`${message.member.user.id}_${command.name}`), timeout)
                }

                if (this.options.handleNormal === true) command.run(command_data);
                else this.emit("normalCommand", command, command_data);
            } catch (e) {
                this.emit("exception", command, message, e);
                if (typeof (command.errors) === "function") command.errors("exception", command, message, e);
            }
        })

    }

    async #replyToInteraction(interaction, content) {
        try {
            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: content,
                        flags: 64
                    }
                }
            })
        } catch (e) {
            console.log(`[Discord-Slash-Command-Handler] : ${e}`)
        }
    }

    /**
     * Reload all the commands of your bot
     */
    async reloadCommands() {
        this.#setCommands()
            .then((v) => {
                console.log("[discord-slash-command-handler] : Commands are reloaded")
                this.emit("commandsCreated", this.client.commands, this.client.commandAliases)
            })
            .catch((e) => {
                console.log("[discord-slash-command-handler] : There was a error in reloading the commands")
            })
    }
}

module.exports = commandHandler;